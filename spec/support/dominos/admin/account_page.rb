module Dom
  module Admin
    class AccountPage < Domino
      selector '.admin_accounts'

      attribute :name, '.attributes_table.pageflow_account .name td'
      attribute :cname, '.attributes_table.pageflow_theming .cname td'
      attribute :theme, '.attributes_table.pageflow_theming .theme td'

      def features_tab
        within(node) do
          find('.tabs > .features a')
        end
      end

      def edit_link
        within(node) do
          find_link(I18n.t('active_admin.edit_model', model: I18n.t('activerecord.models.account.one')))
        end
      end

      def delete_link
        within(node) do
          find_link(I18n.t('active_admin.delete_model', model: I18n.t('activerecord.models.account.one')))
        end
      end
    end
  end
end
