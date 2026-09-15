module Pageflow
  # A blank level falls through to the system default.
  #
  # @api private
  class AccountCommentSettings < ApplicationRecord
    belongs_to :account

    validates :assigned_entries_notification_level, :other_entries_notification_level,
              inclusion: {in: CommentNotificationLevel::STORABLE_PER_ACCOUNT},
              allow_blank: true
  end
end
