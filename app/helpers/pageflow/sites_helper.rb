module Pageflow
  module SitesHelper
    DEFAULT_PUBLIC_ENTRY_OPTIONS = lambda do |site|
      site.cname.present? ? {host: site.cname} : nil
    end

    def pretty_site_url(site)
      pageflow.public_root_url(Pageflow.config.site_url_options(site))
    end
  end
end
