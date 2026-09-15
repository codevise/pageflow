module Pageflow
  FactoryBot.define do
    factory :entry_comment_notification_override, class: EntryCommentNotificationOverride do
      entry
      user
      level { CommentNotificationLevel::MUTED }
    end
  end
end
