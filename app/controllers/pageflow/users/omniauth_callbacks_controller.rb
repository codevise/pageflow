require_dependency 'pageflow/application_controller'

module Pageflow
  module Users
    # oAuth callbacks are handled by this controller
    class OmniauthCallbacksController < Pageflow::ApplicationController
      def auth_callback
        user = AuthenticationToken.user_from_omniauth(auth_hash)
        token = AuthenticationToken.find_auth_token(user, auth_provider)
        if token.empty?
          create_auth_token user
        else
          update_auth_token token
        end
        render_or_redirect
      end

      def failure
        redirect_to root_path
      end

      protected

      def create_auth_token(user)
        AuthenticationToken.create(user_id: user.id,
                                   provider: auth_provider,
                                   auth_token: auth_token,
                                   expiry_time: Time.at(auth_expiry))
      end

      def update_auth_token(token)
        token.update(auth_token: auth_token,
                     expiry_time: Time.at(auth_expiry))
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
        auth_hash[:provider]
      end

      def auth_token
        auth_hash['credentials']['token']
      end

      def auth_expiry
        if auth_hash['credentials']['expires']
          auth_hash['credentials']['expires_at']
        else
          '92503680000' # far far future
        end
      end
    end
  end
end
