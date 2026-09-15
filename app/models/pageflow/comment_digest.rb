module Pageflow
  # The window is half open, so that consecutive sweeps neither skip an
  # event nor mail it twice.
  #
  # @api private
  class CommentDigest
    ThreadGroup = Struct.new(:comment_thread, :events, keyword_init: true)

    attr_reader :user, :entry, :threads

    def initialize(user:, entry:, threads:)
      @user = user
      @entry = entry
      @threads = threads
    end

    def thread_count
      threads.size
    end

    class << self
      def activity_in(since:, until_at:)
        threads = threads_with_activity_in(since...until_at)
        threads_by_entry_id = CommentThread.group_by_entry_id(threads)
        return {} if threads_by_entry_id.empty?

        Entry.where(id: threads_by_entry_id.keys).to_h do |entry|
          [entry, threads_by_entry_id.fetch(entry.id)]
        end
      end

      def recipients(activity)
        return {} if activity.empty?

        user_ids_by_entry_id = candidate_user_ids(activity)
        users = User.where(id: user_ids_by_entry_id.values.flatten.uniq).index_by(&:id)

        user_ids_by_entry_id.transform_values do |user_ids|
          user_ids.uniq.filter_map { |user_id| users[user_id] }
        end
      end

      def for(user, entry, since:, until_at:)
        window = since...until_at
        threads = threads_with_activity_in(window, entry:)
        return if threads.empty?

        build(user, entry, threads, window:)
      end

      private

      def threads_with_activity_in(window, entry: nil)
        scope = entry ? CommentThread.in_entries([entry]) : CommentThread.all

        scope.with_activity_in(window)
             .includes(:resolver, comments: :creator)
             .to_a
      end

      # Over-inclusive on purpose: grading drops the rest.
      def candidate_user_ids(activity)
        entries = activity.keys

        sources = [participant_user_ids(activity),
                   entry_member_user_ids(entries),
                   override_user_ids(entries),
                   all_activity_by_default_user_ids(entries)]

        entries.to_h do |entry|
          [entry.id, sources.flat_map { |source| source.fetch(entry.id, []) }]
        end
      end

      def participant_user_ids(activity)
        activity.to_h do |entry, threads|
          [entry.id, threads.flat_map { |thread| thread.comments.map(&:creator_id) }]
        end
      end

      def entry_member_user_ids(entries)
        group_by_first(
          Membership.on_entries.where(entity_id: entries.map(&:id)).pluck(:entity_id, :user_id)
        )
      end

      def override_user_ids(entries)
        entry_ids = entries.map(&:id)

        group_by_first(
          EntryCommentNotificationOverride.where(entry_id: entry_ids).pluck(:entry_id, :user_id) +
          CommentThreadNotificationOverride.where(entry_id: entry_ids).pluck(:entry_id, :user_id)
        )
      end

      def all_activity_by_default_user_ids(entries)
        opted_in = {account_id: entries.map(&:account_id).uniq,
                    other_entries_notification_level: CommentNotificationLevel::ALL_ACTIVITY}

        opted_in_account_ids = AccountCommentSettings.where(opted_in).pluck(:account_id)

        by_account_id = group_by_first(
          AccountMemberCommentSettings.where(opted_in).pluck(:account_id, :user_id) +
          Membership.on_accounts.where(entity_id: opted_in_account_ids).pluck(:entity_id, :user_id)
        )

        entries.to_h { |entry| [entry.id, by_account_id.fetch(entry.account_id, [])] }
      end

      def group_by_first(pairs)
        pairs.group_by(&:first).transform_values { |rows| rows.map(&:last) }
      end

      def build(user, entry, threads, window:)
        entry_activity =
          EntryCommentActivity.for_entries([entry], user:,
                                                    threads_by_entry_id: {entry.id => threads})
                              .fetch(entry.id)

        groups = notifying_threads(entry_activity, window:)

        new(user:, entry:, threads: groups) if groups.any?
      end

      def notifying_threads(entry_activity, window:)
        entry_activity.notifying_threads.filter_map do |thread|
          events = entry_activity.unread_events(thread)
                                 .select { |event| window.cover?(event.created_at) }
          ThreadGroup.new(comment_thread: thread, events:) if events.any?
        end
      end
    end
  end
end
