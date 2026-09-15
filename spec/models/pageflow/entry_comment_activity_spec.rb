require 'spec_helper'

module Pageflow
  describe EntryCommentActivity do
    describe '#notifying?' do
      it 'is true for unread activity in an entry the user is assigned to' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity).to be_notifying
      end

      it 'is false when the user has muted the entry' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, with_previewer: user)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity).not_to be_notifying
      end

      it 'is false when the user has muted the thread' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
        create(:comment_thread_notification_override,
               entry:, user:, comment_thread_perma_id: thread.perma_id, level: 'muted')

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity).not_to be_notifying
      end

      it 'is false in an entry the user only reaches through the account' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, account: create(:account, with_previewer: user))
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity).not_to be_notifying
      end

      it 'is true once somebody replies in a thread the user commented in' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, account: create(:account, with_previewer: user))
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: user)
        create(:comment, comment_thread: thread, creator: create(:user))

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity).to be_notifying
      end

      it 'is false for activity in a thread the user has not commented in' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, account: create(:account, with_previewer: user))
        own_thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: own_thread, creator: user)
        other_thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: other_thread, creator: create(:user))

        threads = [own_thread.reload, other_thread.reload]

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => threads})
                   .fetch(entry.id)

        expect(activity).not_to be_notifying
      end

      it 'is false without unread activity' do
        user = create(:user, unread_comments_since_at: Time.current)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity).not_to be_notifying
      end
    end

    describe '#notifying_threads' do
      it 'leaves out threads the level does not notify about' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, with_previewer: user)
        notifying_thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: notifying_thread, creator: create(:user))
        muted_thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: muted_thread, creator: create(:user))
        create(:comment_thread_notification_override,
               entry:, user:, comment_thread_perma_id: muted_thread.perma_id, level: 'muted')

        threads = [notifying_thread.reload, muted_thread.reload]

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => threads})
                   .fetch(entry.id)

        expect(activity.notifying_threads).to eq([notifying_thread])
      end

      it 'leaves out threads without unread activity' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: user)

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity.notifying_threads).to eq([])
      end
    end

    describe '#unread_events' do
      it 'yields the events of a thread the user has not seen' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
        create(:comment, comment_thread: thread, creator: create(:user))

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity.unread_events(thread).map(&:kind)).to eq([:topic, :reply])
      end

      it 'skips events from before the read mark' do
        user = create(:user, unread_comments_since_at: 3.hours.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)

        Timecop.freeze(2.hours.ago) do
          create(:comment, comment_thread: thread, creator: create(:user))
        end

        create(:comment_thread_read,
               entry:, user:, comment_thread_perma_id: thread.perma_id, read_at: 1.hour.ago)

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {entry.id => [thread.reload]})
                   .fetch(entry.id)

        expect(activity.unread_events(thread)).to eq([])
      end
    end

    describe '#level' do
      it 'is the notification level resolved for the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {})
                   .fetch(entry.id)

        expect(activity.level).to eq('muted')
      end
    end

    describe '#override_level' do
      it 'is nothing unless the user stored a level for the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        activity = EntryCommentActivity
                   .for_entries([entry], user:, threads_by_entry_id: {})
                   .fetch(entry.id)

        expect(activity.override_level).to be_nil
      end
    end

    it 'does not have N+1 queries' do
      user = create(:user)
      account = create(:account, with_previewer: user)
      entries = Array.new(3) { create(:entry, account:) }
      entries.each do |entry|
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
      end

      threads_by_entry_id = entries.to_h do |entry|
        [entry.id, entry.draft.comment_threads.includes(:comments).to_a]
      end

      detect_n_plus_one_queries do
        EntryCommentActivity.for_entries(entries, user:, threads_by_entry_id:)
                            .each_value(&:notifying?)
      end
    end
  end
end
