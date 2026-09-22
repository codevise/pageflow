require 'spec_helper'

module Pageflow
  describe CommentNotifications do
    describe '#level_for_entry' do
      it 'defaults to all activity for an entry the user is assigned to' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_entry(entry)).to eq('all_activity')
      end

      it 'defaults to thread participation for an entry reached via account role' do
        user = create(:user)
        entry = create(:entry, account: create(:account, with_previewer: user))

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_entry(entry)).to eq('participating_threads')
      end

      it "falls back to the account's default for the entry's bucket" do
        user = create(:user)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings,
               account:,
               assigned_entries_notification_level: 'muted',
               other_entries_notification_level: 'participating_threads')
        entry = create(:entry, account:)

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_entry(entry)).to eq('participating_threads')
      end

      it "prefers the user's own default over the account's" do
        user = create(:user)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings, account:, other_entries_notification_level: 'muted')
        create(:account_member_comment_settings,
               account:, user:, other_entries_notification_level: 'all_activity')
        entry = create(:entry, account:)

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_entry(entry)).to eq('all_activity')
      end

      it "falls through a blank bucket in the user's own default" do
        user = create(:user)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings, account:, other_entries_notification_level: 'muted')
        create(:account_member_comment_settings,
               account:, user:,
               assigned_entries_notification_level: 'all_activity',
               other_entries_notification_level: nil)
        entry = create(:entry, account:)

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_entry(entry)).to eq('muted')
      end

      it 'prefers an entry override over the account rung' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings, account:, other_entries_notification_level: 'muted')
        entry = create(:entry, account:)
        create(:entry_comment_notification_override, entry:, user:, level: 'all_activity')

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_entry(entry)).to eq('all_activity')
      end
    end

    describe '#override_level_for_entry' do
      it 'answers the level the user stored for the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.override_level_for_entry(entry)).to eq('muted')
      end

      it 'answers nothing when the user stored no level for the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.override_level_for_entry(entry)).to be_nil
      end
    end

    describe '#default_level_for_entry' do
      it 'ignores the level the user stored for the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.default_level_for_entry(entry)).to eq('all_activity')
      end
    end

    describe '#bucket_for_entry' do
      it 'is assigned for an entry the user is a member of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.bucket_for_entry(entry)).to eq(:assigned)
      end

      it 'is other for an entry the user reaches through the account' do
        user = create(:user)
        entry = create(:entry, account: create(:account, with_previewer: user))

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.bucket_for_entry(entry)).to eq(:other)
      end
    end

    describe '.for_entry' do
      it 'answers the level of the entry itself' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        expect(CommentNotifications.for_entry(entry, user:).level).to eq('all_activity')
      end

      it 'answers the level of a thread without repeating the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment_thread_notification_override,
               entry:, user:, comment_thread_perma_id: thread.perma_id, level: 'muted')

        notifications = CommentNotifications.for_entry(entry, user:)

        expect(notifications.level_for_thread(thread)).to eq('muted')
      end
    end

    describe '#level_for_thread' do
      it 'prefers a thread override over the entry level' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment_thread_notification_override,
               entry:, user:, comment_thread_perma_id: thread.perma_id, level: 'muted')

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_thread(entry, thread)).to eq('muted')
      end

      it 'falls back to the entry level for a thread without an override' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        muted = create(:comment_thread, revision: entry.draft)
        other = create(:comment_thread, revision: entry.draft)
        create(:comment_thread_notification_override,
               entry:, user:, comment_thread_perma_id: muted.perma_id, level: 'muted')

        notifications = CommentNotifications.new(user:, entries: [entry])

        expect(notifications.level_for_thread(entry, other)).to eq('all_activity')
      end
    end

    it 'does not have N+1 queries' do
      user = create(:user)
      account = create(:account, with_previewer: user)
      entries = Array.new(3) { create(:entry, account:) }
      threads_by_entry = entries.to_h do |entry|
        thread = create(:comment_thread, revision: entry.draft)
        create(:entry_comment_notification_override, entry:, user:, level: 'muted')
        create(:comment_thread_notification_override,
               entry:, user:, comment_thread_perma_id: thread.perma_id, level: 'all_activity')
        [entry, thread]
      end

      detect_n_plus_one_queries do
        notifications = CommentNotifications.new(user:, entries:)
        threads_by_entry.each { |entry, thread| notifications.level_for_thread(entry, thread) }
      end
    end
  end
end
