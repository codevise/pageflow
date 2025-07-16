module Dom
  module Admin
    class AccountsPage < Domino
      selector '.admin_accounts'

      def add_link
        within(node) do
          find_link(I18n.t('active_admin.new_model',
                           model: I18n.t('activerecord.models.account.one')))
        end
      end
    end
  end
end
