module Pageflow
  # A blank level falls through to the account's own default.
  #
  # @api private
  class AccountMemberCommentSettings < ApplicationRecord
    belongs_to :account
    belongs_to :user

    validates :assigned_entries_notification_level, :other_entries_notification_level,
              inclusion: {in: CommentNotificationLevel::STORABLE_PER_ACCOUNT},
              allow_blank: true
  end
end
