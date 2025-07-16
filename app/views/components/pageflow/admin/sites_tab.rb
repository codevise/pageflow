module Pageflow
  module Admin
    # @api private
    class SitesTab < ViewComponent
      def build(account)
        embedded_index_table(account.sites,
                             blank_slate_text: I18n.t('pageflow.admin.accounts.no_sites')) do
          table_for_collection class: 'sites', i18n: Pageflow::Site do
            column :name do |site|
              link_to(site.display_name,
                      admin_account_site_path(site.account, site))
            end
            column :title do |site|
              site.title.presence || '-'
            end
            column :host do |site|
              site.host.presence || '-'
            end
          end
        end

        add_button(account)
      end

      private

      def add_button(account)
        return unless authorized?(:create, Site)

        text_node(link_to(t('pageflow.admin.sites.add'),
                          new_admin_account_site_path(account),
                          class: 'button'))
      end
    end
  end
end
