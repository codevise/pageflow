module Pageflow
  # Keyed by perma id so the override survives comment threads being
  # copied to a new revision.
  #
  # @api private
  class CommentThreadNotificationOverride < CommentNotificationOverride
    validates :comment_thread_perma_id, presence: true
    validates :level, inclusion: {in: CommentNotificationLevel::STORABLE_PER_THREAD}
  end
end
