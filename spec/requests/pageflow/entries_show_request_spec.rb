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

        get(short_entry_url(entry), headers: {'HTTP_ACCEPT' => 'not-known'})

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

      it 'responds with not found for non-published entry' do
        entry = create(:entry, type_name: 'test')

        get(short_entry_url(entry))

        expect(response.status).to eq(404)
        expect(response.body).to include('Not Found')
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
                         account: account)

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
    end
  end
end
