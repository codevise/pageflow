module Pageflow
  module Admin
    # @api private
    class UsersTab < ViewComponent
      def build(account)
        embedded_index_table(account.memberships.on_accounts.includes(:user)
                              .accessible_by(current_ability, :index)
                                            .where('pageflow_memberships.user_id IS NOT NULL'),
                             blank_slate_text: I18n.t('pageflow.admin.accounts.no_members')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :full_name, sortable: 'users.last_name' do |membership|
              link_to membership.user.formal_name, admin_user_path(membership.user)
            end
            column :role, sortable: 'pageflow_memberships.role' do |membership|
              membership_role_with_tooltip(membership.role, scope: 'accounts')
            end
            column :created_at
            column do |membership|
              if authorized?(:update, membership)
                link_to(I18n.t('pageflow.admin.users.edit_role'),
                        edit_admin_account_membership_path(
                          account,
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
                link_to(I18n.t('pageflow.admin.users.delete'),
                        admin_account_membership_path(account, membership),
                        method: :delete,
                        data: {
                          confirm: I18n.t('active_admin.delete_confirmation'),
                          rel: "delete_account_membership_#{membership.role}"
                        })
              end
            end
          end
          if authorized?(:add_member_to, account)
            add_membership_button(current_user, account, 'account')
          end
        end
      end
    end
  end
end
