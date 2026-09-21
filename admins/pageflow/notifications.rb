module Pageflow
  ActiveAdmin.register_page 'Notifications' do
    menu false

    breadcrumb { [] }

    content title: proc { t('pageflow.admin.notifications.title') } do
      render('form')
    end

    page_action :update, method: :patch do
      if current_user.update(notification_params)
        Pageflow.config.hooks.invoke(:user_changed, current_user)

        redirect_to(admin_notifications_path,
                    notice: t('pageflow.admin.notifications.updated'))
      else
        render('active_admin/page/index')
      end
    end

    controller do
      helper Admin::CommentNotificationsHelper
      helper Admin::FormHelper

      before_action :build_missing_comment_settings, only: :index

      private

      # One row per account the user belongs to, so that the form has
      # something to render for accounts they have said nothing about.
      def build_missing_comment_settings
        covered = current_user.account_comment_settings.map(&:account_id)

        current_user.accounts.each do |account|
          current_user.account_comment_settings.build(account:) unless covered.include?(account.id)
        end
      end

      def notification_params
        params.require(:user).permit(
          *Pageflow.config.admin_form_inputs.permitted_attributes_for(:user_notifications),
          account_comment_settings_attributes: [
            :id,
            :account_id,
            :assigned_entries_notification_level,
            :other_entries_notification_level,
            :digest_interval
          ]
        )
      end
    end
  end
end
