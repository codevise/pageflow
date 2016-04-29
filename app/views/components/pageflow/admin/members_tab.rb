module Pageflow
  module Admin
    class MembersTab < ViewComponent
      def build(entry)
        embedded_index_table(entry.memberships.includes(:user).references(:users),
                             blank_slate_text: I18n.t('pageflow.admin.entries.no_members')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :user, sortable: 'users.last_name', class: 'name' do |membership|
              if authorized? :manage, User
                link_to(membership.user.formal_name, admin_user_path(membership.user),
                        class: 'view_creator')
              else
                membership.user.full_name
              end
            end
            column :role,
                   sortable: 'pageflow_memberships.role',
                   title: I18n.t('activerecord.attributes.pageflow/membership.role') do |membership|
              span class: "membership_role #{membership.role}" do
                I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role')
              end
            end
            column :created_at, sortable: 'pageflow_memberships.created_at'
            column do |membership|
              if authorized?(:update, membership)
                link_to(I18n.t('pageflow.admin.users.edit_role'),
                        edit_admin_entry_membership_path(entry, membership, entity_type: :entry),
                        data: {
                          rel: "edit_entry_membership_#{membership.role}"
                        })
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(I18n.t('pageflow.admin.entries.remove'),
                        admin_entry_membership_path(membership.entry, membership),
                        method: :delete,
                        data: {
                          confirm: I18n.t('active_admin.delete_confirmation'),
                          rel: "delete_membership_#{membership.role}"
                        })
              end
            end
          end
        end
        if authorized? :add_member_to, entry
          span do
            link_to(I18n.t('pageflow.admin.users.add'),
                    new_admin_entry_membership_path(entry, entity_type: :entry),
                    class: 'button',
                    data: {rel: 'add_member'})
          end
        end
      end
    end
  end
end
