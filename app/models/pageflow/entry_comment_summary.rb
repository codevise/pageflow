module Pageflow
  # Counts of comment topics and of activity the user has not seen, for
  # displaying an indicator next to an entry in lists of entries.
  #
  # Built for a whole page of entries at once: rendering a list must not
  # query per row.
  #
  # @api private
  class EntryCommentSummary
    attr_reader :topic_count, :unread_topic_count, :unread_reply_count,
                :unread_resolution_count, :override_level

    class << self
      def for_entries(entries, user:)
        entries = entries.to_a
        return {} if entries.empty?

        EntryCommentActivity
          .for_entries(entries, user:, threads_by_entry_id: threads_by_entry_id(entries))
          .transform_values { |activity| build(activity) }
      end

      private

      # Resolved threads come along: somebody resolving a thread is
      # activity of its own.
      def threads_by_entry_id(entries)
        CommentThread.group_by_entry_id(
          CommentThread.in_entries(entries).includes(:comments).to_a
        )
      end

      def build(activity)
        unread_events = activity.threads.map { |thread| activity.unread_events(thread) }

        new(topic_count: activity.threads.count { |thread| !thread.resolved? },
            notifying: activity.notifying?,
            override_level: activity.override_level,
            **unread_counts(unread_events))
      end

      def unread_counts(unread_events)
        kinds = unread_events.map { |events| events.map(&:kind) }

        {unread_topic_count: count_threads_with(kinds, :topic),
         unread_reply_count: kinds.sum { |thread_kinds| thread_kinds.count(:reply) },
         unread_resolution_count: count_threads_with(kinds, :resolution)}
      end

      def count_threads_with(kinds, kind)
        kinds.count { |thread_kinds| thread_kinds.include?(kind) }
      end
    end

    def initialize(topic_count:, unread_topic_count:, unread_reply_count:,
                   unread_resolution_count: 0, notifying: false, override_level: nil)
      @topic_count = topic_count
      @unread_topic_count = unread_topic_count
      @unread_reply_count = unread_reply_count
      @unread_resolution_count = unread_resolution_count
      @notifying = notifying
      @override_level = override_level
    end

    # Unread activity shows even where no topic is left open: the last
    # one being resolved is exactly what the user should not miss.
    def any?
      topic_count.positive? || unread?
    end

    def unread?
      unread_topic_count.positive? ||
        unread_reply_count.positive? ||
        unread_resolution_count.positive?
    end

    def notifying?
      @notifying
    end
  end
end
