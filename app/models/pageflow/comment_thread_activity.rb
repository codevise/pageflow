module Pageflow
  # The events of a comment thread — its topic, its replies and its
  # resolution — and which of them a user has not seen.
  #
  # Kept in sync with threadActivity and isUnread in
  # entry_types/scrolled/package/src/review/unreadActivity.js, which
  # apply the same rules in the review interface.
  #
  # @api private
  module CommentThreadActivity
    Event = Struct.new(:kind, :comment, :creator_id, :created_at, keyword_init: true)

    extend self

    def events(thread)
      topic, *replies = thread.comments.sort_by(&:id)

      result = []
      result << event(:topic, topic) if topic
      replies.each { |reply| result << event(:reply, reply) }
      result << resolution_event(thread) if thread.resolved_at
      result
    end

    def unread_events(thread, read_at:, user:)
      events(thread).select { |event| unread?(event, read_at:, user:) }
    end

    def unread?(event, read_at:, user:)
      seen_up_to = [read_at, user.unread_comments_since_at].compact.max

      event.creator_id != user.id &&
        (seen_up_to.nil? || event.created_at > seen_up_to)
    end

    private

    def event(kind, comment)
      Event.new(kind:, comment:, creator_id: comment.creator_id, created_at: comment.created_at)
    end

    def resolution_event(thread)
      Event.new(kind: :resolution, comment: nil,
                creator_id: thread.resolved_by_id, created_at: thread.resolved_at)
    end
  end
end
