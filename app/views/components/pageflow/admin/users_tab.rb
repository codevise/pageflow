module Pageflow
  module Admin
    class UsersTab < ViewComponent
      def build(theming)
        account = theming.account
        if account.users.any?
          table_for account.users, :i18n => User do
            column :full_name do |user|
              link_to user.full_name, admin_user_path(user)
            end
          end
        else
          div :class => "blank_slate_container" do
            span :class => "blank_slate" do
              I18n.t('pageflow.admin.accounts.no_members')
            end
          end
        end
      end
    end
  end
end
