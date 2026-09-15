require 'spec_helper'

module Pageflow
  describe CommentThreadActivity do
    describe '.events' do
      it 'yields the topic, then the replies' do
        thread = create(:comment_thread)
        create(:comment, comment_thread: thread)
        create(:comment, comment_thread: thread)

        expect(CommentThreadActivity.events(thread.reload).map(&:kind))
          .to eq([:topic, :reply])
      end

      it 'yields a resolution for a resolved thread' do
        thread = create(:comment_thread)
        create(:comment, comment_thread: thread)
        thread.resolve(create(:user))

        expect(CommentThreadActivity.events(thread.reload).map(&:kind))
          .to eq([:topic, :resolution])
      end

      it 'attributes the resolution to whoever resolved the thread' do
        resolver = create(:user)
        thread = create(:comment_thread)
        create(:comment, comment_thread: thread)
        thread.resolve(resolver)

        resolution = CommentThreadActivity.events(thread.reload).last

        expect(resolution.creator_id).to eq(resolver.id)
      end
    end

    describe '.unread' do
      it 'skips the user their own activity' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        thread = create(:comment_thread)
        create(:comment, comment_thread: thread, creator: user)
        create(:comment, comment_thread: thread, creator: create(:user))

        unread = CommentThreadActivity.unread_events(thread.reload, read_at: nil, user:)

        expect(unread.map(&:kind)).to eq([:reply])
      end

      it 'skips activity from before the baseline' do
        user = create(:user, unread_comments_since_at: Time.current)
        thread = create(:comment_thread)
        create(:comment, comment_thread: thread, created_at: 1.day.ago)

        unread = CommentThreadActivity.unread_events(thread.reload, read_at: nil, user:)

        expect(unread).to be_empty
      end

      it 'skips activity from before the read mark' do
        user = create(:user, unread_comments_since_at: 3.days.ago)
        thread = create(:comment_thread)
        create(:comment, comment_thread: thread, created_at: 2.days.ago)

        unread = CommentThreadActivity.unread_events(thread.reload, read_at: 1.day.ago, user:)

        expect(unread).to be_empty
      end

      it 'keeps activity from after both' do
        user = create(:user, unread_comments_since_at: 3.days.ago)
        thread = create(:comment_thread)
        create(:comment, comment_thread: thread, created_at: Time.current)

        unread = CommentThreadActivity.unread_events(thread.reload, read_at: 1.day.ago, user:)

        expect(unread.map(&:kind)).to eq([:topic])
      end
    end
  end
end
