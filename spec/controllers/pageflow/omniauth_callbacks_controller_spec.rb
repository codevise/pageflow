require 'spec_helper'

module Pageflow
  module Users
    describe OmniauthCallbacksController do
      routes { Engine.routes }
      render_views

      before do
        request.env['devise.mapping'] = Devise.mappings[:user]
        request.env['omniauth.auth'] = OmniAuth.config.mock_auth[:default]
        request.env['omniauth.params'] = {
          popup: false
        }
      end
      describe 'auth_callback' do
        it 'should ignore unauthenticated requests' do
          old_token_count = AuthenticationToken.all.count
          get :auth_callback, params: {provider: :default}
          expect(response.status).to eq(302) # because of redirect
          expect(AuthenticationToken.all.count).to eq(old_token_count)
        end

        it 'should create authentication token' do
          user = create(:user)
          sign_in(user, scope: :user)
          post :auth_callback, params: {provider: :default}
          expect(response).to redirect_to root_path # because origin is not given
          token = AuthenticationToken.find_auth_token(user, 'default')
          expect(token).not_to be_empty
        end

        it 'should not create auth token and redirect to root path when auth hash is invalid' do
          request.env['omniauth.auth'] = :invalid_credentials
          user = create(:user)
          sign_in(user, scope: :user)
          post :auth_callback, params: {provider: :default}
          token = AuthenticationToken.find_auth_token(user, 'default')
          expect(token).to be_empty
        end

        it 'should update auth token if it is already there for current user and provider' do
          user = create(:user)
          sign_in(user, scope: :user)
          old_token = AuthenticationToken.create_auth_token(user.id,
                                                            'default',
                                                            '4321',
                                                            925_036_800_00)
          post :auth_callback, params: {provider: :default}
          new_token = AuthenticationToken.find_auth_token(user, 'default').first
          expect(old_token.id).to be_equal(new_token.id)
        end
      end
    end
  end
end
