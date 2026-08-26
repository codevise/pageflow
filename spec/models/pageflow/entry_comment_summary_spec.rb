require 'spec_helper'

module Pageflow
  describe EntryCommentSummary do
    describe '.for_entries' do
      def summary_for(entry, user)
        described_class.for_entries([entry], user:)[entry.id]
      end

      it 'is empty without entries' do
        expect(described_class.for_entries([], user: create(:user))).to eq({})
      end

      it 'counts unresolved threads of the draft revision as topics' do
        user = create(:user)
        entry = create(:entry)
        create(:comment_thread, revision: entry.draft)
        create(:comment_thread, revision: entry.draft)

        expect(summary_for(entry, user).topic_count).to eq(2)
      end

      it 'ignores resolved threads' do
        user = create(:user)
        entry = create(:entry)
        create(:comment_thread, revision: entry.draft, resolved_at: Time.current)

        expect(summary_for(entry, user).topic_count).to eq(0)
      end

      it 'ignores threads of other entries' do
        user = create(:user)
        entry = create(:entry)
        create(:comment_thread, revision: create(:entry).draft)

        expect(summary_for(entry, user).topic_count).to eq(0)
      end

      it 'counts threads whose first comment is unseen as unread topics' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        summary = summary_for(entry, user)

        expect(summary.unread_topic_count).to eq(1)
        expect(summary.unread_reply_count).to eq(0)
      end

      it 'counts unseen comments after the first as unread replies' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
        create(:comment, comment_thread: thread, creator: create(:user))

        summary = summary_for(entry, user)

        expect(summary.unread_topic_count).to eq(1)
        expect(summary.unread_reply_count).to eq(1)
      end

      it 'ignores comments the user wrote' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: user)

        expect(summary_for(entry, user).unread_topic_count).to eq(0)
      end

      it 'ignores comments from before the users baseline' do
        user = create(:user, unread_comments_since_at: Time.current)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)

        Timecop.freeze(2.hours.ago) do
          create(:comment, comment_thread: thread, creator: create(:user))
        end

        expect(summary_for(entry, user).unread_topic_count).to eq(0)
      end

      it 'ignores comments from before the thread was read' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)

        Timecop.freeze(2.hours.ago) do
          create(:comment, comment_thread: thread, creator: create(:user))
        end

        create(:comment_thread_read,
               entry:,
               user:,
               comment_thread_perma_id: thread.perma_id,
               read_at: 1.hour.ago)

        expect(summary_for(entry, user).unread_topic_count).to eq(0)
      end

      it 'keeps read state of other users apart' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
        create(:comment_thread_read,
               entry:,
               user: create(:user),
               comment_thread_perma_id: thread.perma_id)

        expect(summary_for(entry, user).unread_topic_count).to eq(1)
      end

      it 'returns a summary per entry' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry)
        other_entry = create(:entry)
        create(:comment_thread, revision: entry.draft)

        result = described_class.for_entries([entry, other_entry], user:)

        expect(result[entry.id].topic_count).to eq(1)
        expect(result[other_entry.id].topic_count).to eq(0)
      end

      it 'does not have N+1 queries' do
        user = create(:user)
        entries = Array.new(3) { create(:entry) }
        entries.each do |entry|
          thread = create(:comment_thread, revision: entry.draft)
          create(:comment, comment_thread: thread, creator: create(:user))
          create(:comment, comment_thread: thread, creator: create(:user))
        end

        detect_n_plus_one_queries do
          described_class.for_entries(entries, user:)
        end
      end
    end

    describe '#unread?' do
      it 'is true with unread topics or unread replies' do
        expect(build_summary(unread_topic_count: 1)).to be_unread
        expect(build_summary(unread_reply_count: 1)).to be_unread
        expect(build_summary).not_to be_unread
      end

      def build_summary(unread_topic_count: 0, unread_reply_count: 0)
        described_class.new(topic_count: 1, unread_topic_count:, unread_reply_count:)
      end
    end
  end
end
