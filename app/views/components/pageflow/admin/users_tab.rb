module Pageflow
  module Admin
    class UsersTab < ViewComponent
      def build(theming)
        account = theming.account
        embedded_index_table account.users, blank_slate_text: I18n.t('pageflow.admin.entries.no_members') do
          table_for_collection :class => 'users', :i18n => User do
            column :full_name do |user|
              link_to user.full_name, admin_user_path(user)
            end
          end
        end
      end
    end
  end
end
