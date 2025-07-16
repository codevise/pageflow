module Pageflow
  module SitesHelper # rubocop:todo Style/Documentation
    DEFAULT_SITE_URL_OPTIONS = lambda do |site|
      site.cname.present? ? {host: site.cname} : nil
    end

    def pretty_site_url(site)
      pageflow.public_root_url(Pageflow.config.site_url_options_for(site))
    end
  end
end
