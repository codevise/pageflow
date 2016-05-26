module Pageflow
  module Admin
    class UserAccountsTab < ViewComponent
      def build(user)
        embedded_index_table(user.memberships.on_accounts.includes(:account)
                              .accessible_by(Ability.new(current_user), :index),
                             blank_slate_text: I18n.t('pageflow.admin.users.no_accounts')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :account, sortable: 'pageflow_accounts.name' do |membership|
              if authorized?(:read, membership.entity)
                link_to(membership.entity.name, admin_account_path(membership.entity))
              else
                membership.entity.name
              end
            end
            column :role, sortable: 'pageflow_memberships.role' do |membership|
              span I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role'),
                   class: "membership_role #{membership.role} tooltip_clue" do
                div I18n.t(membership.role,
                           scope: 'pageflow.admin.users.roles.accounts.tooltip'),
                    class: 'tooltip_bubble'
              end
            end
            column :created_at, sortable: 'pageflow_memberships.created_at'
            column do |membership|
              if authorized?(:update, membership)
                link_to(I18n.t('pageflow.admin.users.edit_role'),
                        edit_admin_user_membership_path(user, membership, entity_type: :account),
                        data: {
                          rel: "edit_account_role_#{membership.role}"
                        })
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(I18n.t('pageflow.admin.users.delete'),
                        admin_user_membership_path(user, membership),
                        method: :delete,
                        data: {
                          confirm: I18n.t('active_admin.delete_confirmation'),
                          rel: "delete_account_membership_#{membership.role}"
                        })
              end
            end
          end
          render 'add_membership_button_if_needed', entity_type: 'account'
        end
      end
    end
  end
end
