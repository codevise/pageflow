module Pageflow
  module Admin
    class MembersTab < ViewComponent
      def build(entry)
        embedded_index_table(entry.memberships.includes(:user).references(:users),
                             blank_slate_text: I18n.t('pageflow.admin.entries.no_members')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :user, sortable: 'users.last_name', class: 'name' do |membership|
              if authorized? :read, membership.user
                link_to(membership.user.formal_name, admin_user_path(membership.user),
                        class: 'view_creator')
              else
                membership.user.full_name
              end
            end
            column :role,
                   sortable: 'pageflow_memberships.role',
                   title: I18n.t('activerecord.attributes.pageflow/membership.role') do |membership|
              span I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role'),
                   class: "membership_role #{membership.role} tooltip_clue" do
                div I18n.t(membership.role,
                           scope: 'pageflow.admin.users.roles.entries.tooltip'),
                    class: 'tooltip_bubble'
              end
            end
            column :created_at, sortable: 'pageflow_memberships.created_at'
            column do |membership|
              if authorized?(:update, membership)
                link_to(I18n.t('pageflow.admin.users.edit_role'),
                        edit_admin_entry_membership_path(entry,
                                                         membership,
                                                         entity_type: :entry),
                        data: {
                          rel: "edit_entry_membership_#{membership.role}"
                        })
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(I18n.t('pageflow.admin.entries.remove'),
                        admin_entry_membership_path(membership.entity, membership),
                        method: :delete,
                        data: {
                          confirm: I18n.t('active_admin.delete_confirmation'),
                          rel: "delete_membership_#{membership.role}"
                        })
              end
            end
          end
        end
        para text_node I18n.t('pageflow.admin.resource_tabs.account_editor_hint')
        if authorized?(:add_member_to, entry) &&
           membership_users_collection(resource,
                                       Membership.new(entity: resource),
                                       Membership.new).any?
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
