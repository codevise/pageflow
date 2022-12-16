module Pageflow
  module Admin
    class SitesTab < ViewComponent
      def build(account)
        embedded_index_table(account.sites,
                             blank_slate_text: I18n.t('pageflow.admin.accounts.no_sites')) do
          table_for_collection class: 'sites', i18n: Pageflow::Site do
            column :cname do |site|
              link_to(site.cname.presence || '(Default)',
                      admin_account_site_path(site.account, site))
            end
          end
        end
      end
    end
  end
end
