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
    Event = Struct.new(:kind, :creator_id, :created_at, keyword_init: true)

    extend self

    def events(thread)
      topic, *replies = thread.comments.sort_by(&:id)

      result = []
      result << event(:topic, topic.creator_id, topic.created_at) if topic
      replies.each { |reply| result << event(:reply, reply.creator_id, reply.created_at) }
      result << event(:resolution, thread.resolved_by_id, thread.resolved_at) if thread.resolved_at
      result
    end

    def unread_events(thread, read_at:, user:)
      seen_up_to = [read_at, user.unread_comments_since_at].compact.max

      events(thread).select { |event| unread?(event, seen_up_to:, user:) }
    end

    private

    def event(kind, creator_id, created_at)
      Event.new(kind:, creator_id:, created_at:)
    end

    def unread?(event, seen_up_to:, user:)
      event.creator_id != user.id &&
        (seen_up_to.nil? || event.created_at > seen_up_to)
    end
  end
end
