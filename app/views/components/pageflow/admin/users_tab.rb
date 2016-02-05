module Pageflow
  module Admin
    class UsersTab < ViewComponent
      def build(theming)
        account = theming.account
        embedded_index_table(account.users,
                             blank_slate_text: I18n.t('pageflow.admin.accounts.no_members')) do
          table_for_collection sortable: true, class: 'users', i18n: User do
            column :full_name, sortable: :last_name do |user|
              link_to user.formal_name, admin_user_path(user)
            end
            column :created_at
          end
        end
      end
    end
  end
end
