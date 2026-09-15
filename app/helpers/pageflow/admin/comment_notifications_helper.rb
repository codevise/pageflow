module Pageflow
  module Admin
    # @api private
    module CommentNotificationsHelper
      # An account role below previewer reaches no entries, which
      # leaves the setting for the other bucket applying to nothing.
      def comment_notifications_reach_other_entries?(user, account)
        role = user.memberships.on_accounts.find_by(entity_id: account.id)&.role

        Roles.at_least(:previewer).include?(role)
      end

      def comment_notifications_user_legend(account, account_count)
        return t('pageflow.admin.comment_notifications.user.legend') if account_count == 1

        t('pageflow.admin.comment_notifications.user.legend_with_account', account: account.name)
      end

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
