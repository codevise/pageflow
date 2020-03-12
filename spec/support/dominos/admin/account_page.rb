module Dom
  module Admin
    class AccountPage < Domino
      selector '.admin_accounts'

      attribute :name, '.attributes_table.pageflow_account .name td'
      attribute :cname, '.attributes_table.pageflow_theming .cname td'
      attribute :theme, '.attributes_table.pageflow_entry_template .theme td'

      attribute :default_author,
                '.attributes_table.pageflow_entry_template .default_author td'
      attribute :default_publisher,
                '.attributes_table.pageflow_entry_template .default_publisher td'
      attribute :default_keywords,
                '.attributes_table.pageflow_entry_template .default_keywords td'

      def features_tab
        within(node) do
          find('.admin_tabs_view-tabs > .features a')
        end
      end

      def edit_link
        within(node) do
          find_link(I18n.t('active_admin.edit_model',
                           model: I18n.t('activerecord.models.account.one')))
        end
      end

      def delete_link
        within(node) do
          find_link(I18n.t('active_admin.delete_model',
                           model: I18n.t('activerecord.models.account.one')))
        end
      end

      def add_account_membership_link
        within(node) do
          find('[data-rel=add_member]')
        end
      end

      def edit_account_role_link(role)
        within(node) do
          find("[data-rel=edit_account_role_#{role}]")
        end
      end

      def delete_member_on_account_link(role)
        within(node) do
          find("[data-rel=delete_account_membership_#{role}]")
        end
      end

      def has_role_flag?(role)
        within(node) do
          has_selector?(".memberships .#{role}")
        end
      end
    end
  end
end
