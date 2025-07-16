module Pageflow
  module Admin
    # @api private
    class UserEntriesTab < ViewComponent
      def build(user)
        embedded_index_table(user.memberships.on_entries
                               .includes(:entry, entry: :account).references(:pageflow_entries)
                               .accessible_by(current_ability, :index),
                             blank_slate_text: t('pageflow.admin.users.no_entries')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :entry, sortable: 'pageflow_entries.title' do |membership|
              link_to(membership.entry.title, admin_entry_path(membership.entry))
            end
            column :role, sortable: 'pageflow_memberships.role' do |membership|
              membership_role_with_tooltip(membership.role, scope: 'entries')
            end
            column :account, sortable: 'pageflow_accounts.name' do |membership|
              if authorized?(:read, membership.entry.account)
                link_to(membership.entry.account.name,
                        admin_account_path(membership.entry.account))
              else
                membership.entry.account.name
              end
            end
            column :created_at, sortable: 'pageflow_memberships.created_at'
            column do |membership|
              if authorized?(:update, membership)
                link_to(t('pageflow.admin.users.edit_role'),
                        edit_admin_user_membership_path(
                          user,
                          membership,
                          entity_type: 'Pageflow::Entry'
                        ),
                        data: {
                          rel: "edit_entry_role_#{membership.role}"
                        })
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(t('pageflow.admin.users.delete'),
                        admin_user_membership_path(user, membership),
                        method: :delete,
                        data: {
                          confirm: t('pageflow.admin.users.delete_entry_membership_confirmation'),
                          rel: "delete_entry_membership_#{membership.role}"
                        })
              end
            end
          end
          add_membership_button(current_user, user, 'entry')
        end
      end
    end
  end
end
