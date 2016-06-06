module Pageflow
  module Admin
    class UsersTab < ViewComponent
      def build(theming)
        account = theming.account
        embedded_index_table(account.memberships.on_accounts.includes(:user)
                              .accessible_by(Ability.new(current_user), :index)
                                            .where('pageflow_memberships.user_id IS NOT NULL'),
                             blank_slate_text: I18n.t('pageflow.admin.accounts.no_members')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :full_name, sortable: 'users.last_name' do |membership|
              link_to membership.user.formal_name, admin_user_path(membership.user)
            end
            column :role, sortable: 'pageflow_memberships.role' do |membership|
              span I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role'),
                   class: "membership_role #{membership.role} tooltip_clue" do
                div I18n.t(membership.role,
                           scope: 'pageflow.admin.users.roles.accounts.tooltip'),
                    class: 'tooltip_bubble'
              end
            end
            column :created_at
            column do |membership|
              if authorized?(:update, membership)
                link_to(I18n.t('pageflow.admin.users.edit_role'),
                        edit_admin_account_membership_path(membership.entity,
                                                           membership,
                                                           entity_type: :account),
                        data: {
                          rel: "edit_account_role_#{membership.role}"
                        })
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(I18n.t('pageflow.admin.users.delete'),
                        admin_account_membership_path(membership.entity, membership),
                        method: :delete,
                        data: {
                          confirm: I18n.t('active_admin.delete_confirmation'),
                          rel: "delete_account_membership_#{membership.role}"
                        })
              end
            end
          end
          if AccountPolicy::Scope.new(current_user, Pageflow::Account).member_addable &&
             membership_users_collection(resource, Membership.new(entity: resource)).any?
            span do
              link_to(I18n.t('pageflow.admin.users.add'),
                      new_admin_account_membership_path(account, entity_type: :account),
                      class: 'button',
                      data: {rel: 'add_member'})
            end
          end
        end
      end
    end
  end
end
