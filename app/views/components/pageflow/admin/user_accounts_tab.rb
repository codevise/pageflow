module Pageflow
  module Admin
    # @api private
    class UserAccountsTab < ViewComponent
      def build(user)
        embedded_index_table(user.memberships.on_accounts
                               .includes(:account).references(:pageflow_accounts)
                               .accessible_by(current_ability, :index),
                             blank_slate_text: t('pageflow.admin.users.no_accounts')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :account, sortable: 'pageflow_accounts.name' do |membership|
              if authorized?(:read, membership.account)
                link_to(membership.account.name, admin_account_path(membership.account))
              else
                membership.account.name
              end
            end
            column :role, sortable: 'pageflow_memberships.role' do |membership|
              membership_role_with_tooltip(membership.role, scope: 'accounts')
            end
            column :created_at, sortable: 'pageflow_memberships.created_at'
            column do |membership|
              if authorized?(:update, membership)
                link_to(t('pageflow.admin.users.edit_role'),
                        edit_admin_user_membership_path(
                          user,
                          membership,
                          entity_type: 'Pageflow::Account'
                        ),
                        data: {
                          rel: "edit_account_role_#{membership.role}"
                        })
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(t('pageflow.admin.users.delete'),
                        admin_user_membership_path(user, membership),
                        method: :delete,
                        data: {
                          confirm: t('pageflow.admin.users.delete_account_membership_confirmation'),
                          rel: "delete_account_membership_#{membership.role}"
                        })
              end
            end
          end
          if authorized?(:add_account_to, :users)
            add_membership_button(current_user, user, 'account')
          end
        end
      end
    end
  end
end
