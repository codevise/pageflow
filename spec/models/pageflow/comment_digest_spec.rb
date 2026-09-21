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

      it 'says nothing to a user who takes no digest mail' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        create(:account_member_comment_settings,
               account: entry.account, user:, digest_interval: 'never')
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
      end

      it 'says nothing to a user whose account takes no digest mail' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, with_previewer: user)
        create(:account_comment_settings, account: entry.account, digest_interval: 'never')
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))

        expect(CommentDigest.for(user, entry, since: 1.day.ago, until_at: 1.minute.from_now))
          .to be_nil
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

    describe '.sweep' do
      it 'yields everybody the activity in an entry could notify' do
        user, entry = entry_with_activity_written(1.hour.ago)

        due = sweep

        expect(due.map(&:user)).to include(user)
        expect(due.map(&:entry).uniq).to eq([entry])
      end

      it 'yields the users who commented in the entry' do
        author = create(:user)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: author, created_at: 1.hour.ago)

        due = sweep

        expect(due.map(&:user)).to include(author)
      end

      it 'keeps the members of one entry out of another entry' do
        user, = entry_with_activity_written(1.hour.ago)
        _other_user, other_entry = entry_with_activity_written(1.hour.ago)

        due = sweep

        expect(due.select { |entry_digest| entry_digest.entry == other_entry }.map(&:user))
          .not_to include(user)
      end

      it 'yields the window from the horizon for an unswept entry' do
        entry_with_activity_written(1.hour.ago)

        due = sweep

        expect(due.first.since).to eq(24.hours.ago)
        expect(due.first.until_at).to eq(Time.current)
      end

      it 'yields the window from the entry watermark once it has one' do
        _user, entry = entry_with_activity_written(1.hour.ago)
        create(:comment_digest_watermark, entry:, considered_up_to: 2.hours.ago)

        due = sweep

        expect(due.first.since).to eq(2.hours.ago)
      end

      it 'yields nothing about activity from before the horizon' do
        entry_with_activity_written(2.days.ago)

        due = sweep

        expect(due).to be_empty
      end

      it 'does not repeat what an earlier sweep considered' do
        entry_with_activity_written(1.hour.ago)
        sweep

        due = sweep(at: 20.minutes.from_now)

        expect(due).to be_empty
      end

      it 'leaves an entry alone when another entry has new activity' do
        entry_with_activity_written(1.hour.ago)
        _other_user, other_entry = entry_with_activity_written(1.hour.ago)
        sweep
        create(:comment, comment_thread: create(:comment_thread, revision: other_entry.draft),
                         creator: create(:user))

        due = sweep(at: 20.minutes.from_now)

        expect(due.map(&:entry).uniq).to eq([other_entry])
      end

      it 'moves the watermark of an entry it swept' do
        _user, entry = entry_with_activity_written(1.hour.ago)

        sweep

        expect(CommentDigestWatermark.considered_up_to_by_entry_id[entry.id])
          .to eq(Time.current)
      end

      it 'moves the watermark of an entry whose activity notifies nobody' do
        user = create(:user, unread_comments_since_at: 2.days.ago)
        entry = create(:entry, account: create(:account, with_previewer: user))
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user),
                         created_at: 1.hour.ago)

        sweep

        expect(CommentDigestWatermark.considered_up_to_by_entry_id).to include(entry.id)
      end

      it 'moves no watermark when enqueueing fails' do
        _user, entry = entry_with_activity_written(1.hour.ago)

        expect { sweep { raise 'no queue' } }.to raise_error('no queue')

        expect(CommentDigestWatermark.where(entry:)).to be_empty
      end

      it 'moves no watermark for an entry without activity' do
        create(:entry)

        sweep

        expect(CommentDigestWatermark.count).to eq(0)
      end

      it 'yields nothing while the entry is still busy' do
        entry_with_activity_written(5.minutes.ago)

        expect(sweep).to be_empty
      end

      it 'moves no watermark while the entry is still busy' do
        _user, entry = entry_with_activity_written(5.minutes.ago)

        sweep

        expect(CommentDigestWatermark.where(entry:)).to be_empty
      end

      it 'yields the whole burst once the entry has fallen quiet' do
        _user, entry = entry_with_activity_written(5.minutes.ago)
        sweep

        due = sweep(at: 20.minutes.from_now)

        expect(due.map(&:entry).uniq).to eq([entry])
        expect(due.first.since).to eq(20.minutes.from_now - 24.hours)
      end

      it 'yields an entry that fell quiet beside one that did not' do
        _user, entry = entry_with_activity_written(1.hour.ago)
        entry_with_activity_written(5.minutes.ago)

        expect(sweep.map(&:entry).uniq).to eq([entry])
      end

      it 'gives up holding an entry that has been busy for too long' do
        _user, entry = entry_with_activity_written(3.hours.ago)
        create(:comment, comment_thread: create(:comment_thread, revision: entry.draft),
                         creator: create(:user), created_at: 1.minute.ago)

        expect(sweep.map(&:entry).uniq).to eq([entry])
      end

      it 'never holds an entry for longer than a sweep can still see it' do
        expect(Pageflow.config.comment_digest_max_hold)
          .to be < Pageflow.config.comment_digest_max_lookback
      end

      it 'leaves out somebody who has turned digest mail off' do
        user, entry = entry_with_activity_written(1.hour.ago)
        create(:account_member_comment_settings,
               account: entry.account, user:, digest_interval: 'never')

        expect(sweep.map(&:user)).not_to include(user)
      end

      it 'leaves out everybody in an account that sends no digest mail' do
        user, entry = entry_with_activity_written(1.hour.ago)
        create(:account_comment_settings, account: entry.account, digest_interval: 'never')

        expect(sweep.map(&:user)).not_to include(user)
      end

      it 'keeps somebody who asked for mail in such an account' do
        user, entry = entry_with_activity_written(1.hour.ago)
        create(:account_comment_settings, account: entry.account, digest_interval: 'never')
        create(:account_member_comment_settings,
               account: entry.account, user:, digest_interval: 'continuous')

        expect(sweep.map(&:user)).to include(user)
      end

      it 'keeps somebody who turned mail off in another account' do
        user, = entry_with_activity_written(1.hour.ago)
        create(:account_member_comment_settings, user:, digest_interval: 'never')

        expect(sweep.map(&:user)).to include(user)
      end

      def sweep(at: Time.current, max_lookback: 24.hours,
                quiet_period: 15.minutes, max_hold: 2.hours)
        [].tap do |due|
          CommentDigest.sweep(at:, max_lookback:, quiet_period:, max_hold:) do |entry_digest|
            due << entry_digest
            yield entry_digest if block_given?
          end
        end
      end

      def entry_with_activity_written(created_at)
        user = create(:user, unread_comments_since_at: 3.days.ago)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user), created_at:)
        [user, entry]
      end
    end
  end
end
