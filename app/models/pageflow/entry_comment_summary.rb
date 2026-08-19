module Pageflow
  # Counts of comment topics and comments the user has not seen, for
  # displaying an indicator next to an entry in lists of entries.
  #
  # Built for a whole page of entries at once: rendering a list must not
  # query per row.
  #
  # @api private
  class EntryCommentSummary
    attr_reader :topic_count, :unread_topic_count, :unread_reply_count

    def self.for_entries(entries, user:)
      entries = entries.to_a
      return {} if entries.empty?

      threads = unresolved_threads_by_entry_id(entries)
      read_at = read_at_by_entry_id(entries, user)

      entries.to_h do |entry|
        [entry.id, build(threads.fetch(entry.id, []),
                         read_at: read_at.fetch(entry.id, {}),
                         user:)]
      end
    end

    def initialize(topic_count:, unread_topic_count:, unread_reply_count:)
      @topic_count = topic_count
      @unread_topic_count = unread_topic_count
      @unread_reply_count = unread_reply_count
    end

    def any?
      topic_count.positive?
    end

    def unread?
      unread_topic_count.positive? || unread_reply_count.positive?
    end

    # Comment threads live on the draft revision, so entries are reached
    # through their editable revision rather than directly.
    def self.unresolved_threads_by_entry_id(entries)
      entry_id_by_revision_id =
        Revision.editable.where(entry_id: entries.map(&:id)).pluck(:id, :entry_id).to_h

      CommentThread
        .where(revision_id: entry_id_by_revision_id.keys, resolved_at: nil)
        .includes(:comments)
        .group_by { |thread| entry_id_by_revision_id[thread.revision_id] }
    end
    private_class_method :unresolved_threads_by_entry_id

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
      unread_topics = 0
      unread_replies = 0

      threads.each do |thread|
        first, *replies = thread.comments.sort_by(&:id)
        seen_up_to = [read_at[thread.perma_id], user.unread_comments_since_at].compact.max

        unread_topics += 1 if first && unread?(first, seen_up_to, user)
        unread_replies += replies.count { |reply| unread?(reply, seen_up_to, user) }
      end

      new(topic_count: threads.size,
          unread_topic_count: unread_topics,
          unread_reply_count: unread_replies)
    end
    private_class_method :build

    # Mirrors the unread rule of the review interface: own comments never
    # count, and neither do comments from before the user's baseline.
    # Kept in sync with isUnseen in
    # entry_types/scrolled/package/src/review/unreadComments.js.
    def self.unread?(comment, seen_up_to, user)
      comment.creator_id != user.id &&
        (seen_up_to.nil? || comment.created_at > seen_up_to)
    end
    private_class_method :unread?
  end
end
