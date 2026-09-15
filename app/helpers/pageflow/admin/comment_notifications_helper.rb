module Pageflow
  module Admin
    # @api private
    module CommentNotificationsHelper
      def comment_notification_level_options(scope)
        CommentNotificationLevel::STORABLE_PER_ACCOUNT.map do |level|
          [t("pageflow.admin.comment_notifications.#{scope}.levels.#{level}"), level]
        end
      end

      def resolved_comment_notification_levels(*settings)
        settings.compact.reduce(CommentNotificationLevel::SYSTEM_DEFAULTS) do |levels, rung|
          levels.merge(
            {assigned: rung.assigned_entries_notification_level.presence,
             other: rung.other_entries_notification_level.presence}.compact
          )
        end
      end
    end
  end
end
