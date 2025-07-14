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
              membership_role_with_tooltip(membership.role, scope: 'entries')
            end
            column :created_at, sortable: 'pageflow_memberships.created_at'
            column do |membership|
              if authorized?(:update, membership)
                link_to(I18n.t('pageflow.admin.users.edit_role'),
                        edit_admin_entry_membership_path(
                          entry,
                          membership,
                          entity_type: 'Pageflow::Entry'
                        ),
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

        div class: 'side_hint' do
          para text_node I18n.t('pageflow.admin.resource_tabs.account_editor_hint')
        end

        return unless authorized?(:add_member_to, entry)

        add_membership_button(current_user, entry, 'entry')
      end
    end
  end
end
