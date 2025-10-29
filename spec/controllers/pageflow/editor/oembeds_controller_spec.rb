require 'spec_helper'

module Pageflow
  module Editor
    describe OembedsController do
      routes { Engine.routes }
      render_views

      before do
        pageflow_configure do |config|
          config.oembed_providers.register(
            :test_provider,
            endpoint: 'https://example.com/oembed.{format}',
            url_patterns: ['https://example.com/posts/*']
          )
        end
      end

      describe '#show' do
        it 'resolves URL to oEmbed data via HTTP request' do
          user = create(:user)
          url = 'https://example.com/posts/abc123'

          stub_request(:get, 'https://example.com/oembed.json')
            .with(query: {url: url})
            .to_return(
              status: 200,
              body: {
                html: '<blockquote>Example post</blockquote>',
                title: 'Post by example',
                provider_name: 'Test Provider'
              }.to_json,
              headers: {'Content-Type' => 'application/json'}
            )

          sign_in(user, scope: :user)
          get(:show, params: {provider: 'test_provider', url: url}, format: 'json')

          expect(response.status).to eq(200)
          expect(response.body).to include_json(
            html: '<blockquote>Example post</blockquote>',
            title: 'Post by example',
            provider_name: 'Test Provider'
          )
        end

        it 'requires user to be signed in' do
          url = 'https://example.com/posts/abc123'

          get(:show, params: {provider: 'test_provider', url: url}, format: 'json')

          expect(response.status).to eq(401)
        end

        it 'returns error when URL cannot be resolved' do
          user = create(:user)
          url = 'https://example.com/posts/invalid'

          stub_request(:get, 'https://example.com/oembed.json')
            .with(query: {url: url})
            .to_return(status: 404)

          sign_in(user, scope: :user)
          get(:show, params: {provider: 'test_provider', url: url}, format: 'json')

          expect(response.status).to eq(404)
        end

        it 'returns error when provider is not registered' do
          user = create(:user)
          url = 'https://example.com/posts/abc123'

          sign_in(user, scope: :user)
          get(:show, params: {provider: 'unknown_provider', url: url}, format: 'json')

          expect(response.status).to eq(422)
        end

        it 'returns error when provider parameter is missing' do
          user = create(:user)
          url = 'https://example.com/posts/abc123'

          sign_in(user, scope: :user)
          get(:show, params: {url: url}, format: 'json')

          expect(response.status).to eq(422)
        end
      end
    end
  end
end
