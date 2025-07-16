module Pageflow
  # @api private
  class SitemapsController < Pageflow::ApplicationController
    def index
      site = Site.for_request(request).first!
      return head 404 unless site.sitemap_enabled?

      @entries = Sitemaps.entries_for(site:)

      respond_to do |format|
        format.xml
      end
    end
  end
end
