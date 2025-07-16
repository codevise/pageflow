module Pageflow
  # @api private
  class FeedsController < Pageflow::ApplicationController
    def index
      site = Site.for_request(request).first!
      return head 404 unless site.feeds_enabled?

      @feed = EntriesFeed.for(
        site:,
        locale: params[:locale]
      )

      respond_to do |format|
        format.atom
      end
    end
  end
end
