module Pageflow
  # @api private
  class EntryCommentNotificationOverride < CommentNotificationOverride
    validates :level, inclusion: {in: CommentNotificationLevel::STORABLE_PER_ENTRY}
  end
end
