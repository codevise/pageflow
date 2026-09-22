module Pageflow
  # The notification levels and read marks it works from are loaded
  # for a whole page of entries at once by .for_entries. Threads come
  # with their comments loaded, since participation reads them for
  # every thread.
  #
  # @api private
  class EntryCommentActivity
    def self.for_entries(entries, user:, threads_by_entry_id:)
      notifications = CommentNotifications.new(user:, entries:)
      read_at = CommentThreadRead.read_at_by_entry_id(entries:, user:)

      entries.to_h do |entry|
        [entry.id, new(entry:, user:, notifications:,
                       threads: threads_by_entry_id.fetch(entry.id, []),
                       read_at: read_at.fetch(entry.id, {}))]
      end
    end

    attr_reader :threads

    def initialize(entry:, user:, threads:, notifications:, read_at:)
      @entry = entry
      @user = user
      @threads = threads
      @notifications = notifications
      @read_at = read_at
    end

    def level
      @notifications.level_for_entry(@entry)
    end

    def override_level
      @notifications.override_level_for_entry(@entry)
    end

    def digest_enabled?
      @notifications.digest_enabled_for_entry?(@entry)
    end

    def unread_events(thread)
      unread_events_by_thread.fetch(thread)
    end

    def notifying?
      notifying_threads.any?
    end

    def notifying_threads
      @notifying_threads ||=
        threads.select { |thread| unread_events(thread).any? && notifies_about?(thread) }
    end

    private

    def notifies_about?(thread)
      level = @notifications.level_for_thread(@entry, thread)

      CommentNotificationLevel.notifies?(level, participated_in?(thread))
    end

    def participated_in?(thread)
      thread.comments.any? { |comment| comment.creator_id == @user.id }
    end

    def unread_events_by_thread
      @unread_events_by_thread ||=
        threads.to_h do |thread|
          [thread,
           CommentThreadActivity.unread_events(thread,
                                               read_at: @read_at[thread.perma_id],
                                               user: @user)]
        end
    end
  end
end
