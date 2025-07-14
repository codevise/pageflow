require 'spec_helper'

module Pageflow
  describe '/:slug request', type: :request do
    let(:entry_type_app) do
      lambda do |env|
        entry = EntriesControllerEnvHelper.get_published_entry_from_env(env)
        mode = EntriesControllerEnvHelper.get_entry_mode_from_env(env)

        ['200',
         {'Content-Type' => 'text/html'},
         ["#{entry.title} #{mode} rendered by entry type frontend app."]]
      end
    end

    before do
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'test',
                               frontend_app: entry_type_app)
      end
    end

    context 'with format */*' do
      it 'responds with forbidden for entry published with password' do
        entry = create(:entry, :published_with_password,
                       password: 'abc123abc')

        get(short_entry_url(entry), headers: {'HTTP_ACCEPT' => '*/*'})

        expect(response.status).to eq(401)
      end
    end

    context 'with other known format' do
      it 'responds with not found' do
        entry = create(:entry, :published, type_name: 'test')

        get(short_entry_url(entry), headers: {'HTTP_ACCEPT' => 'image/png'})

        expect(response.status).to eq(404)
      end
    end

    context 'with unknown format' do
      it 'responds with not found' do
        entry = create(:entry, :published, type_name: 'test')

        get(short_entry_url(entry), headers: {'HTTP_ACCEPT' => 'application/pdf'})

        expect(response.status).to eq(404)
      end
    end

    describe 'with html format' do
      it 'delegates to entry type frontend app for published entry' do
        entry = create(:entry, :published, type_name: 'test', title: 'some-entry')

        get(short_entry_url(entry))

        expect(response.status).to eq(200)
        expect(response.body).to include('some-entry published rendered by entry type frontend app')
      end

      it 'supports finding published entry based on permalink' do
        site = create(:site, cname: 'my.example.com')
        create(
          :entry,
          :published,
          title: 'some-entry',
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'custom-slug'
          }
        )

        get('http://my.example.com/custom-slug')

        expect(response.status).to eq(200)
        expect(response.body)
          .to include('some-entry published rendered by entry type frontend app')
      end

      it 'supports finding published entry based on permalink with directory' do
        site = create(:site, cname: 'my.example.com')
        create(
          :entry,
          :published,
          title: 'some-entry',
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'custom-slug',
            directory_path: 'en/'
          }
        )

        get('http://my.example.com/en/custom-slug')

        expect(response.status).to eq(200)
        expect(response.body)
          .to include('some-entry published rendered by entry type frontend app')
      end

      it 'redirects to renamed permalink' do
        site = create(:site, cname: 'my.example.com')
        entry = create(
          :entry,
          :published,
          title: 'some-entry',
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'old-slug',
            directory_path: 'en/'
          }
        )

        entry.permalink.update!(slug: 'new-slug')
        get('http://my.example.com/en/old-slug')

        expect(response).to redirect_to('http://my.example.com/en/new-slug')
      end

      it 'redirects even when new entry with same permalink is created but not yet published' do
        site = create(:site, cname: 'my.example.com')
        directory = create(:permalink_directory, site:)
        entry = create(
          :entry,
          :published,
          title: 'some-entry',
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'old-slug',
            directory:
          }
        )

        entry.permalink.update!(slug: 'new-slug')
        create(
          :entry,
          title: 'new-entry',
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'old-slug',
            directory:
          }
        )
        get('http://my.example.com/old-slug')

        expect(response).to redirect_to('http://my.example.com/new-slug')
      end

      it 'no longer redirects when new entry with same permalink is published' do
        site = create(:site, cname: 'my.example.com')
        directory = create(:permalink_directory, site:)
        entry = create(
          :entry,
          :published,
          title: 'some-entry',
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'old-slug',
            directory:
          }
        )

        entry.permalink.update!(slug: 'new-slug')
        create(
          :entry,
          :published,
          title: 'new-entry',
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'old-slug',
            directory:
          }
        )
        get('http://my.example.com/old-slug')

        expect(response.body).to include('new-entry')
      end

      it 'redirects to permalink that moved to different site' do
        site = create(:site, cname: 'my.example.com')
        entry = create(
          :entry,
          :published,
          type_name: 'test',
          site:,
          permalink_attributes: {
            slug: 'some-slug',
            directory_path: 'en/'
          }
        )
        other_site = create(:site, cname: 'other.example.com')
        directory_of_other_site = create(:permalink_directory, site: other_site)

        entry.update!(site: other_site, permalink_attributes: {directory: directory_of_other_site})
        get('http://my.example.com/en/some-slug')

        expect(response).to redirect_to('http://other.example.com/some-slug')
      end

      it 'responds with not found for non-published entry' do
        entry = create(:entry, type_name: 'test')

        get(short_entry_url(entry))

        expect(response.status).to eq(404)
        expect(response.body).to include('Not Found')
      end

      it 'renders custom 404 entry when site has custom_404_entry configured' do
        site = create(:site, cname: 'my.example.com')
        custom_404_entry = create(:entry, :published,
                                  type_name: 'test',
                                  title: 'Custom 404',
                                  site:)
        site.update!(custom_404_entry:)

        get('http://my.example.com/non-existent-entry')

        expect(response.status).to eq(404)
        expect(response.body).to include('Custom 404 published rendered by entry type frontend app')
      end

      it 'falls back to default 404 when site has no custom_404_entry' do
        create(:site, cname: 'my.example.com')

        get('http://my.example.com/non-existent-entry')

        expect(response.status).to eq(404)
        expect(response.body).to include("The page you've requested cannot be found.")
      end

      it 'renders site-specific custom 404 entry' do
        site1 = create(:site, cname: 'site1.example.com')
        site2 = create(:site, cname: 'site2.example.com')

        custom_404_entry1 = create(:entry, :published,
                                   type_name: 'test',
                                   title: 'Site 1 Not Found',
                                   site: site1)
        custom_404_entry2 = create(:entry, :published,
                                   type_name: 'test',
                                   title: 'Site 2 Not Found',
                                   site: site2)

        site1.update!(custom_404_entry: custom_404_entry1)
        site2.update!(custom_404_entry: custom_404_entry2)

        get('http://site1.example.com/non-existent')
        expect(response.status).to eq(404)
        expect(response.body).to include('Site 1 Not Found')

        get('http://site2.example.com/non-existent')
        expect(response.status).to eq(404)
        expect(response.body).to include('Site 2 Not Found')
      end

      it 'falls back to default 404 when custom_404_entry is not published' do
        site = create(:site, cname: 'my.example.com')
        unpublished_404_entry = create(:entry, type_name: 'test', site:)
        site.update!(custom_404_entry: unpublished_404_entry)

        get('http://my.example.com/non-existent-entry')

        expect(response.status).to eq(404)
        expect(response.body).to include("The page you've requested cannot be found.")
      end

      it 'falls back to default 404 when custom_404_entry is password protected' do
        site = create(:site, cname: 'my.example.com')
        password_protected_404_entry = create(:entry, :published_with_password,
                                              type_name: 'test',
                                              password: 'secret123',
                                              site:)
        site.update!(custom_404_entry: password_protected_404_entry)

        get('http://my.example.com/non-existent-entry')

        expect(response.status).to eq(404)
        expect(response.body).to include("The page you've requested cannot be found.")
      end

      it 'responds with forbidden for entry published with password' do
        entry = create(:entry, :published_with_password,
                       password: 'abc123abc',
                       type_name: 'test')

        get(short_entry_url(entry))

        expect(response.status).to eq(401)
      end

      it 'responds with success for entry published with password when correct password is '\
         'supplied' do
        entry = create(:entry, :published_with_password,
                       type_name: 'test',
                       password: 'abc123abc')

        authorization =
          ActionController::HttpAuthentication::Basic.encode_credentials('Pageflow', 'abc123abc')

        get(short_entry_url(entry), headers: {'HTTP_AUTHORIZATION' => authorization})

        expect(response.status).to eq(200)
      end

      context 'with configured entry_request_scope' do
        before do
          Pageflow.config.public_entry_request_scope = lambda do |entries, request|
            entries.includes(:account).where(pageflow_accounts: {name: request.subdomain})
          end
        end

        it 'responds with success for matching entry' do
          account = create(:account, name: 'news')
          entry = create(:entry, :published,
                         type_name: 'test',
                         account:)

          get(short_entry_url(entry), headers: {'HTTP_HOST' => 'news.example.com'})

          expect(response.status).to eq(200)
        end

        it 'responds with not found for non-matching entry' do
          entry = create(:entry, :published,
                         type_name: 'test')

          get(short_entry_url(entry), headers: {'HTTP_HOST' => 'news.example.com'})

          expect(response.status).to eq(404)
        end
      end

      describe 'with configured public_entry_redirect' do
        it 'redirects to returned location' do
          entry = create(:entry, :published,
                         type_name: 'test')

          Pageflow.config.public_entry_redirect = ->(_, _) { '/some_location' }

          get(short_entry_url(entry))

          expect(response).to redirect_to('/some_location')
        end

        it 'redirects even before https redirect takes place' do
          entry = create(:entry, :published,
                         type_name: 'test')

          Pageflow.config.public_https_mode = :enforce
          Pageflow.config.public_entry_redirect = ->(_, _) { '/some_location' }

          get(short_entry_url(entry))

          expect(response).to redirect_to('/some_location')
        end

        it 'passes entry and request' do
          create(:entry, :published,
                 title: 'some-entry',
                 type_name: 'test')

          Pageflow.config.public_entry_redirect = lambda do |passed_entry, request|
            "#{request.protocol}#{request.host}/#{passed_entry.slug}"
          end

          get('http://www.example.com/some-entry')

          expect(response).to redirect_to('http://www.example.com/some-entry')
        end

        it 'allows redirecting to other host' do
          entry = create(:entry, :published,
                         type_name: 'test')

          Pageflow.config.public_entry_redirect = ->(_, _) { 'http://www.example.com/' }

          get(short_entry_url(entry), headers: {'HTTP_HOST' => 'pageflow.example.com'})

          expect(response).to redirect_to('http://www.example.com/')
        end

        it 'does not redirect if nil is returned' do
          entry = create(:entry, :published,
                         type_name: 'test')

          Pageflow.config.public_entry_redirect = ->(_, _) { nil }

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
        end
      end

      describe 'X-Frame-Options header' do
        let(:entry_type_app_setting_frame_header) do
          lambda do |_env|
            [
              '200',
              {
                'Content-Type' => 'text/html',
                'X-Frame-Options' => 'sameorigin'
              },
              ['Rendered by entry type frontend app.']
            ]
          end
        end

        before do
          pageflow_configure do |config|
            TestEntryType.register(config,
                                   name: 'test_with_frame_header',
                                   frontend_app: entry_type_app_setting_frame_header)
          end
        end

        it 'is preserved by default' do
          entry = create(:entry, :published,
                         type_name: 'test_with_frame_header')

          get(short_entry_url(entry))

          expect(response.headers).to include('X-Frame-Options')
        end

        context 'with embed parameter' do
          it 'is removed' do
            entry = create(:entry, :published,
                           type_name: 'test_with_frame_header')

            get(entry_embed_url(entry))

            expect(response.headers).not_to include('X-Frame-Options')
          end
        end
      end

      context 'https mode' do
        it 'redirects to https when https is enforced' do
          entry = create(:entry, :published,
                         type_name: 'test',
                         title: 'some-entry')

          Pageflow.config.public_https_mode = :enforce

          get(short_entry_url(entry, protocol: 'http'))

          expect(response).to redirect_to('https://www.example.com/some-entry')
        end

        it 'redirects to http when https is prevented' do
          entry = create(:entry, :published,
                         type_name: 'test',
                         title: 'some-entry')
          Pageflow.config.public_https_mode = :prevent

          get(short_entry_url(entry, protocol: 'https'))

          expect(response).to redirect_to('http://www.example.com/some-entry')
        end

        it 'stays on https when https mode is ignored' do
          entry = create(:entry, :published,
                         type_name: 'test')

          Pageflow.config.public_https_mode = :ignore

          get(short_entry_url(entry, protocol: 'https'))

          expect(response.status).to eq(200)
        end

        it 'stays on http when https mode is ignored' do
          entry = create(:entry, :published,
                         type_name: 'test')

          Pageflow.config.public_https_mode = :ignore

          get(short_entry_url(entry, protocol: 'http'))

          expect(response.status).to eq(200)
        end
      end

      describe 'Cache-Control header' do
        it 'prevents caching by default' do
          entry = create(:entry, :published,
                         type_name: 'test')

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
          expect(response.headers['Cache-Control']).to eq('no-cache')
        end

        it 'uses public_entry_cache_control_header config for published entry without password' do
          pageflow_configure do |config|
            config.public_entry_cache_control_header = 'public, max-age=600'
          end

          entry = create(:entry, :published,
                         type_name: 'test')

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
          expect(response.headers['Cache-Control']).to eq('public, max-age=600')
        end

        it 'is not set for entry published with password' do
          pageflow_configure do |config|
            config.public_entry_cache_control_header = 'public, max-age=600'
          end

          entry = create(:entry, :published_with_password,
                         type_name: 'test',
                         password: 'abc123abc')

          authorization =
            ActionController::HttpAuthentication::Basic.encode_credentials('Pageflow', 'abc123abc')

          get(short_entry_url(entry), headers: {'HTTP_AUTHORIZATION' => authorization})

          expect(response.status).to eq(200)
          expect(response.headers['Cache-Control']).to eq('no-cache')
        end

        it 'does not use config from feature flag by default' do
          pageflow_configure do |config|
            config.public_entry_cache_control_header = 'public, max-age=600'

            config.features.register('long_cache') do |feature_config|
              feature_config.public_entry_cache_control_header = 'public, max-age=3600'
            end
          end

          entry = create(:entry, :published,
                         type_name: 'test')

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
          expect(response.headers['Cache-Control']).to eq('public, max-age=600')
        end

        it 'uses config from feature flag if enabled' do
          pageflow_configure do |config|
            config.public_entry_cache_control_header = 'public, max-age=600'

            config.features.register('long_cache') do |feature_config|
              feature_config.public_entry_cache_control_header = 'public, max-age=3600'
            end
          end

          entry = create(:entry, :published,
                         type_name: 'test',
                         with_feature: 'long_cache')

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
          expect(response.headers['Cache-Control']).to eq('public, max-age=3600')
        end
      end

      describe 'with additional headers' do
        it 'adds headers to responds' do
          pageflow_configure do |config|
            config.additional_public_entry_headers.register('X-Some' => 'value')
          end

          entry = create(:entry, :published,
                         type_name: 'test')

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
          expect(response.headers['X-Some']).to eq('value')
        end

        it 'passes entry and request to callable' do
          pageflow_configure do |config|
            config.additional_public_entry_headers.register(
              lambda do |entry, request|
                {
                  'X-From-Entry' => entry.type_name,
                  'X-From-Request' => request.subdomain
                }
              end
            )
          end

          entry = create(:entry, :published,
                         type_name: 'test')

          get(short_entry_url(entry), headers: {'HTTP_HOST' => 'news.example.com'})

          expect(response.status).to eq(200)
          expect(response.headers['X-From-Entry']).to eq('test')
          expect(response.headers['X-From-Request']).to eq('news')
        end

        it 'does not use headers registered in feature flag by default' do
          pageflow_configure do |config|
            config.features.register('some_header') do |feature_config|
              feature_config.additional_public_entry_headers.register('X-Some' => 'value')
            end
          end

          entry = create(:entry, :published,
                         type_name: 'test')

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
          expect(response.headers).not_to have_key('X-Some')
        end

        it 'uses headers registered in enabled feature flag' do
          pageflow_configure do |config|
            config.features.register('some_header') do |feature_config|
              feature_config.additional_public_entry_headers.register('X-Some' => 'value')
            end
          end

          entry = create(:entry, :published,
                         type_name: 'test',
                         with_feature: 'some_header')

          get(short_entry_url(entry))

          expect(response.status).to eq(200)
          expect(response.headers['X-Some']).to eq('value')
        end
      end
    end
  end
end
