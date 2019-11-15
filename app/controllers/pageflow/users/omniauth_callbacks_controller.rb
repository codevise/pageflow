require_dependency 'pageflow/application_controller'

module Pageflow
  module Users
    # oAuth callbacks are handled by this controller
    class OmniauthCallbacksController < Pageflow::ApplicationController
      before_action :authenticate_user!

      def auth_callback
        result = AuthenticationToken.find_auth_token(current_user, auth_provider)
        if result.empty?
          create_auth_token current_user
        else
          update_auth_token result.first
        end
        render_or_redirect
      end

      def failure
        redirect_to root_path
      end

      protected

      def create_auth_token(user)
        AuthenticationToken.create_auth_token(user.id,
                                              auth_provider,
                                              auth_token,
                                              auth_expiry)
      end

      def update_auth_token(token)
        AuthenticationToken.update_token token, auth_token, auth_expiry
      end

      def render_or_redirect
        @page = auth_origin
        if auth_popup
          render 'auth_callback', layout: false
        else
          redirect_to @page || root_path
        end
      end

      def auth_popup
        request.env['omniauth.params']['popup']
      end

      def auth_origin
        request.env['omniauth.origin']
      end

      def auth_hash
        request.env['omniauth.auth']
      end

      def auth_provider
        auth_hash['provider']
      end

      def auth_token
        auth_hash['credentials']['token']
      end

      def auth_expiry
        if auth_hash['credentials']['expires']
          auth_hash['credentials']['expires_at']
        else
          925_036_800_00 # far far future
        end
      end
    end
  end
end
