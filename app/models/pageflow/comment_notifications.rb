module Pageflow
  # A user's notification level for entries and comment threads,
  # resolved through the rungs of overrides and defaults.
  #
  # Built for a whole page of entries at once: rendering a list must
  # not query per row.
  #
  # @api private
  class CommentNotifications
    def self.for_entry(entry, user:)
      EntryScope.new(new(user:, entries: [entry]), entry)
    end

    def initialize(user:, entries:)
      @user = user
      @entries = entries.to_a
    end

    def level_for_thread(entry, comment_thread)
      thread_levels[[entry.id, comment_thread.perma_id]] || level_for_entry(entry)
    end

    def level_for_entry(entry)
      override_level_for_entry(entry) || default_level_for_entry(entry)
    end

    def override_level_for_entry(entry)
      entry_levels[entry.id]
    end

    def default_level_for_entry(entry)
      bucket = bucket_for_entry(entry)

      member_defaults.dig(entry.account_id, bucket) ||
        account_defaults.dig(entry.account_id, bucket) ||
        CommentNotificationLevel::SYSTEM_DEFAULTS.fetch(bucket)
    end

    def digest_enabled_for_entry?(entry)
      CommentDigestInterval.enabled?(member_defaults.dig(entry.account_id, :digest_interval),
                                     account_defaults.dig(entry.account_id, :digest_interval))
    end

    def bucket_for_entry(entry)
      assigned_entry_ids.include?(entry.id) ? :assigned : :other
    end

    private

    def thread_levels
      @thread_levels ||=
        CommentThreadNotificationOverride
        .where(user: @user, entry_id: entry_ids)
        .pluck(:entry_id, :comment_thread_perma_id, :level)
        .to_h { |entry_id, perma_id, level| [[entry_id, perma_id], level] }
    end

    def entry_levels
      @entry_levels ||=
        EntryCommentNotificationOverride
        .where(user: @user, entry_id: entry_ids)
        .pluck(:entry_id, :level)
        .to_h
    end

    def assigned_entry_ids
      @assigned_entry_ids ||=
        Membership.on_entries.where(user: @user, entity_id: entry_ids).pluck(:entity_id).to_set
    end

    def member_defaults
      @member_defaults ||=
        defaults_by_account_id(
          AccountMemberCommentSettings.where(user: @user, account_id: account_ids)
        )
    end

    def account_defaults
      @account_defaults ||=
        defaults_by_account_id(AccountCommentSettings.where(account_id: account_ids))
    end

    def defaults_by_account_id(scope)
      scope
        .pluck(:account_id, :assigned_entries_notification_level,
               :other_entries_notification_level, :digest_interval)
        .to_h do |account_id, assigned, other, digest_interval|
          [account_id, {assigned: assigned.presence,
                        other: other.presence,
                        digest_interval: digest_interval.presence}]
        end
    end

    def entry_ids
      @entry_ids ||= @entries.map(&:id)
    end

    def account_ids
      @account_ids ||= @entries.map(&:account_id).uniq
    end

    # Callers working inside one entry ask about its threads without
    # naming the entry again at every call.
    class EntryScope
      def initialize(notifications, entry)
        @notifications = notifications
        @entry = entry
      end

      def level
        @notifications.level_for_entry(@entry)
      end

      def override_level
        @notifications.override_level_for_entry(@entry)
      end

      def default_level
        @notifications.default_level_for_entry(@entry)
      end

      def bucket
        @notifications.bucket_for_entry(@entry)
      end

      def level_for_thread(comment_thread)
        @notifications.level_for_thread(@entry, comment_thread)
      end
    end
  end
end
