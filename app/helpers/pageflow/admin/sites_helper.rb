module Pageflow
  module Admin
    # @api private
    module SitesHelper
      def site_home_url_hint(site)
        if site&.persisted?
          if (root_entry = site.root_entry)
            t('pageflow.admin.sites.home_url_with_root_entry_hint_html',
              entry_title: root_entry.title,
              entry_url: admin_entry_path(root_entry))
          else
            t('pageflow.admin.sites.home_url_hint_html',
              choose_url: admin_site_root_entry_choose_path(site_id: site),
              new_url: new_admin_entry_path(site_id: site, at: 'root'))
          end
        else
          t('pageflow.admin.sites.home_url_new_site_hint')
        end
      end
    end
  end
end
