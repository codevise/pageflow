module Pageflow
  module Editor
    # @api private
    class OembedsController < Pageflow::ApplicationController
      respond_to :json

      before_action :authenticate_user!

      def show
        provider = Pageflow.config.oembed_providers.find_by_name!(params[:provider])
        oembed_response = provider.get(params[:url])

        render json: oembed_response.fields
      rescue Pageflow::OembedProviderNotFoundError
        head :unprocessable_entity
      rescue OEmbed::NotFound
        head :not_found
      end
    end
  end
end
