module Pageflow
  # Counts of comment topics and of activity the user has not seen, for
  # displaying an indicator next to an entry in lists of entries.
  #
  # Built for a whole page of entries at once: rendering a list must not
  # query per row.
  #
  # @api private
  class EntryCommentSummary
    attr_reader :topic_count, :unread_topic_count, :unread_reply_count, :unread_resolution_count

    def self.for_entries(entries, user:)
      entries = entries.to_a
      return {} if entries.empty?

      threads = threads_by_entry_id(entries)
      read_at = read_at_by_entry_id(entries, user)

      entries.to_h do |entry|
        [entry.id, build(threads.fetch(entry.id, []),
                         read_at: read_at.fetch(entry.id, {}),
                         user:)]
      end
    end

    def initialize(topic_count:, unread_topic_count:, unread_reply_count:,
                   unread_resolution_count: 0)
      @topic_count = topic_count
      @unread_topic_count = unread_topic_count
      @unread_reply_count = unread_reply_count
      @unread_resolution_count = unread_resolution_count
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

    # Comment threads live on the draft revision, so entries are reached
    # through their editable revision rather than directly. Resolved ones
    # come along: somebody resolving a thread is activity of its own.
    def self.threads_by_entry_id(entries)
      entry_id_by_revision_id =
        Revision.editable.where(entry_id: entries.map(&:id)).pluck(:id, :entry_id).to_h

      CommentThread
        .where(revision_id: entry_id_by_revision_id.keys)
        .includes(:comments)
        .group_by { |thread| entry_id_by_revision_id[thread.revision_id] }
    end
    private_class_method :threads_by_entry_id

    def self.read_at_by_entry_id(entries, user)
      CommentThreadRead
        .where(user:, entry_id: entries.map(&:id))
        .pluck(:entry_id, :comment_thread_perma_id, :read_at)
        .group_by(&:first)
        .transform_values do |rows|
          rows.to_h { |(_entry_id, perma_id, read_at)| [perma_id, read_at] }
        end
    end
    private_class_method :read_at_by_entry_id

    def self.build(threads, read_at:, user:)
      unread = threads.map { |thread| unread_activity(thread, read_at:, user:) }

      new(topic_count: threads.count { |thread| thread.resolved_at.nil? },
          unread_topic_count: unread.count { |kinds| kinds.include?(:topic) },
          unread_reply_count: unread.sum { |kinds| kinds.count(:reply) },
          unread_resolution_count: unread.count { |kinds| kinds.include?(:resolution) })
    end
    private_class_method :build

    # What the user has not seen in a thread, as one symbol per event.
    # The resolution goes by the thread's read mark like the comments do,
    # having none of its own.
    def self.unread_activity(thread, read_at:, user:)
      seen_up_to = [read_at[thread.perma_id], user.unread_comments_since_at].compact.max
      first, *replies = thread.comments.sort_by(&:id)

      unread_replies = replies.count do |reply|
        unread?(reply.creator_id, reply.created_at, seen_up_to, user)
      end

      kinds = Array.new(unread_replies, :reply)
      kinds << :topic if first && unread?(first.creator_id, first.created_at, seen_up_to, user)
      kinds << :resolution if unread_resolution?(thread, seen_up_to, user)
      kinds
    end
    private_class_method :unread_activity

    def self.unread_resolution?(thread, seen_up_to, user)
      thread.resolved_at &&
        unread?(thread.resolved_by_id, thread.resolved_at, seen_up_to, user)
    end
    private_class_method :unread_resolution?

    # Mirrors the unread rule of the review interface: the user's own
    # activity never counts, and neither does anything from before their
    # baseline. Kept in sync with isUnread in
    # entry_types/scrolled/package/src/review/unreadActivity.js.
    def self.unread?(creator_id, created_at, seen_up_to, user)
      creator_id != user.id && (seen_up_to.nil? || created_at > seen_up_to)
    end
    private_class_method :unread?
  end
end
