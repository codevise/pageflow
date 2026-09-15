require 'spec_helper'

module Pageflow
  describe CommentDigest do
    describe '.for' do
      it 'reports notifying activity to a user assigned to the entry' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        digest = CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now)

        expect(digest.entry).to eq(entry)
        expect(digest.threads.map(&:comment_thread)).to eq([thread])
        expect(digest.threads.first.events.map(&:kind)).to eq([:topic])
      end

      it 'says nothing about activity in another entry' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        other_entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: other_entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
      end

      it 'says nothing to a user who only reaches the entry through the account' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, account: create(:account, with_previewer: user))
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
      end

      it 'reports a reply in a thread such a user has commented in' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, account: create(:account, with_previewer: user))
        own_thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: own_thread, creator: user)
        create(:comment, comment_thread: own_thread, creator: create(:user))
        other_thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: other_thread, creator: create(:user))

        digest = CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now)

        expect(digest.threads.map(&:comment_thread)).to eq([own_thread])
      end

      it 'says nothing about the user own activity' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: user)

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
      end

      it 'says nothing about activity the user has already read' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
        CommentThreadRead.mark(entry:, user:, comment_thread_perma_ids: [thread.perma_id])

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
      end

      it 'says nothing when the user has muted the entry' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
      end

      it 'reports to a user who set the entry to all activity' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, account: create(:account, with_previewer: user))
        create(:entry_comment_notification_override, entry:, user:, level: 'all_activity')
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .not_to be_nil
      end

      it 'reports to a user whose account default asks for all activity' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings,
               account:, other_entries_notification_level: 'all_activity')
        entry = create(:entry, account:)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .not_to be_nil
      end

      it 'ignores activity from before the given time' do
        user = create(:user, unread_comments_since_at: 3.days.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user),
                         created_at: 2.days.ago)

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
      end

      it 'leaves out events from before the given time in an active thread' do
        user = create(:user, unread_comments_since_at: 3.days.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user),
                         created_at: 2.days.ago)
        create(:comment, comment_thread: thread, creator: create(:user))

        digest = CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now)

        expect(digest.threads.first.events.map(&:kind)).to eq([:reply])
      end

      it 'leaves out events from after the window' do
        user = create(:user, unread_comments_since_at: 3.days.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user),
                         created_at: 2.hours.ago)
        create(:comment, comment_thread: thread, creator: create(:user),
                         created_at: 10.minutes.ago)

        digest = CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.hour.ago)

        expect(digest.threads.first.events.map(&:kind)).to eq([:topic])
      end

      it 'counts the threads it reports' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        2.times do
          thread = create(:comment_thread, revision: entry.draft)
          create(:comment, comment_thread: thread, creator: create(:user))
        end

        digest = CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now)

        expect(digest.thread_count).to eq(2)
      end
    end

    describe '.activity_in' do
      it 'yields each entry with the threads carrying its activity' do
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        activity = CommentDigest.activity_in(since: 1.day.ago, until_at: 1.minute.from_now)

        expect(activity).to eq(entry => [thread])
      end

      it 'yields nothing without activity in the window' do
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user),
                         created_at: 2.days.ago)

        activity = CommentDigest.activity_in(since: 1.day.ago, until_at: 1.minute.from_now)

        expect(activity).to be_empty
      end
    end

    describe '.recipients' do
      it 'yields everybody the activity in an entry could notify' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        recipients = CommentDigest.recipients(entry => [thread])

        expect(recipients[entry.id]).to include(user)
      end

      it 'keeps the members of one entry out of another entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        other_entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
        other_thread = create(:comment_thread, revision: other_entry.draft)
        create(:comment, comment_thread: other_thread, creator: create(:user))

        recipients = CommentDigest.recipients(entry => [thread], other_entry => [other_thread])

        expect(recipients[other_entry.id]).not_to include(user)
      end

      it 'yields the users who commented in the entry' do
        author = create(:user)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: author)

        recipients = CommentDigest.recipients(entry => [thread])

        expect(recipients[entry.id]).to include(author)
      end

      it 'yields nobody without activity' do
        expect(CommentDigest.recipients({})).to be_empty
      end
    end
  end
end
