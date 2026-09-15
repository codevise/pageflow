module Pageflow
  FactoryBot.define do
    factory :comment_thread_notification_override, class: CommentThreadNotificationOverride do
      entry
      user
      comment_thread_perma_id { 1 }
      level { CommentNotificationLevel::MUTED }
    end
  end
end
