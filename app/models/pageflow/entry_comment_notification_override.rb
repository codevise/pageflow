module Pageflow
  # @api private
  class EntryCommentNotificationOverride < ApplicationRecord
    belongs_to :entry
    belongs_to :user

    validates :level, inclusion: {in: CommentNotificationLevel::STORABLE_PER_ENTRY}
  end
end
