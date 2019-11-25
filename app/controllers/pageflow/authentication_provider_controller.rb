module Pageflow
  # Used in the oauth authentication process
  class AuthenticationProviderController < Pageflow::ApplicationController
    before_action :authenticate_user!
    respond_to :json

    def authenticate_importer
      authentication_provider = file_importer.authentication_provider
      authentication_required = if authentication_provider.present?
                                  find_auth_token(authentication_provider).empty?
                                else
                                  false
                                end
      render json: {
        authenticationRequired: authentication_required,
        provider: authentication_provider
      }
    end

    private

    def file_importer
      importer_key = params[:file_import_id]
      Pageflow.config.file_importers.find_by_name!(importer_key)
    end

    def find_auth_token(authentication_provider)
      AuthenticationToken.find_auth_token(current_user, authentication_provider)
    end
  end
end
