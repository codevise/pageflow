require 'spec_helper'

module Pageflow
  describe EntriesController do
    routes { Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    describe '#index' do
      it 'redirects to home url of theming with matching cname' do
        create(:theming, cname: 'pageflow.example.com', home_url: 'http://example.com/overview')

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index)

        expect(response).to redirect_to('http://example.com/overview')
      end

      it 'responds with not found if no theming matches cname' do
        request.env['HTTP_HOST'] = 'unknown.example.com'
        get(:index)

        expect(response.status).to eq(404)
      end

      it 'responds with not found if theming with matching cname does not have home_url' do
        create(:theming, cname: 'pageflow.example.com')

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index)

        expect(response.status).to eq(404)
      end

      it 'uses configures theming_request_scope' do
        Pageflow.config.theming_request_scope = lambda do |themings, request|
          themings.where(id: Account.find_by_name!(request.subdomain).default_theming_id)
        end
        theming = create(:theming, home_url: 'http://example.com')
        create(:account, name: 'some-example', default_theming: theming)

        request.env['HTTP_HOST'] = 'some-example.pageflow.io'
        get(:index)

        expect(response).to redirect_to('http://example.com')
      end

      it 'responds with not found if theming_request_scope raises RecordNotFound' do
        Pageflow.config.theming_request_scope = lambda do |themings, request|
          themings.where(id: Account.find_by_name!(request.subdomain).default_theming_id)
        end

        request.env['HTTP_HOST'] = 'none.pageflow.io'
        get(:index)

        expect(response.status).to eq(404)
      end

      it 'responds with not found if theming_request_scope returns theming with blank home_url' do
        Pageflow.config.theming_request_scope = lambda do |themings, request|
          themings.where(id: Account.find_by_name!(request.subdomain).default_theming_id)
        end
        theming = create(:theming)
        create(:account, name: 'some-example', default_theming: theming)

        request.env['HTTP_HOST'] = 'some-example.pageflow.io'
        get(:index)

        expect(response.status).to eq(404)
      end
    end

    describe '#edit' do
      it 'reponds with success for editors of the entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        get(:edit, id: entry)

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user)
        get(:edit, id: entry)

        expect(response).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:edit, id: entry)

        expect(response).to redirect_to(main_app.new_user_session_path)
      end
    end

    describe '#update' do
      it 'responds with success' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in user
        acquire_edit_lock(user, entry)
        patch(:update, id: entry, entry: {title: 'new', credits: 'credits'}, format: 'json')

        expect(response.status).to eq(204)
      end

      it 'updates title and credits in draft' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in user
        acquire_edit_lock(user, entry)
        patch(:update, id: entry, entry: {title: 'new', credits: 'credits'}, format: 'json')

        expect(entry.draft.reload.title).to eq('new')
        expect(entry.draft.credits).to eq('credits')
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in user
        patch(:update, id: entry, entry: {}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        patch(:update, id: entry, chapter: {}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#show' do
      context 'with format */*' do
        it 'responds with forbidden for entry published with password' do
          entry = create(:entry, :published_with_password, password: 'abc123abc')

          request.env['HTTP_ACCEPT'] = '*/*'
          get(:show, id: entry)

          expect(response.status).to eq(401)
        end
      end

      context 'with format html' do
        it 'responds with success for published entry' do
          entry = create(:entry, :published)

          get(:show, id: entry)

          expect(response.status).to eq(200)
        end

        it 'responds with not found for non-published entry' do
          entry = create(:entry)

          get(:show, id: entry)

          expect(response.status).to eq(404)
        end

        it 'responds with forbidden for entry published with password' do
          entry = create(:entry, :published_with_password, password: 'abc123abc')

          get(:show, id: entry)

          expect(response.status).to eq(401)
        end

        it 'responds with success for entry published with password when correct password is '\
           'supplied' do
          entry = create(:entry, :published_with_password, password: 'abc123abc')

          request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Basic
                                              .encode_credentials('Pageflow', 'abc123abc')
          get(:show, id: entry)

          expect(response.status).to eq(200)
        end

        it 'uses locale of entry' do
          entry = create(:entry, :published, published_revision_attributes: {locale: 'de'})

          get(:show, id: entry)

          expect(response.body).to have_selector('html[lang=de]')
        end

        it 'renders widgets for entry' do
          widget_type = TestWidgetType.new(name: 'test_widget',
                                           rendered: '<div class="test_widget"></div>')

          pageflow_configure do |config|
            config.widget_types.register(widget_type)
          end

          entry = create(:entry, :published)
          create(:widget, subject: entry.published_revision, type_name: 'test_widget')

          get(:show, id: entry)

          expect(response.body).to have_selector('div.test_widget')
        end

        it 'renders widgets which are disabled in editor and preview' do
          widget_type = TestWidgetType.new(name: 'test_widget',
                                           enabled_in_editor: false,
                                           enabled_in_preview: false,
                                           rendered: '<div class="test_widget"></div>')

          pageflow_configure do |config|
            config.widget_types.register(widget_type)
          end

          entry = create(:entry, :published)
          create(:widget, subject: entry.published_revision, type_name: 'test_widget')

          get(:show, id: entry)

          expect(response.body).to have_selector('div.test_widget')
        end

        it 'renders widget\'s head fragments for entry' do
          widget_type =
            TestWidgetType.new(name: 'test_widget',
                               rendered_head_fragment: '<meta name="some_test" content="value">')

          pageflow_configure do |config|
            config.widget_types.register(widget_type)
          end

          entry = create(:entry, :published)
          create(:widget, subject: entry.published_revision, type_name: 'test_widget')

          get(:show, id: entry)

          expect(response.body).to have_meta_tag.with_name('some_test')
        end

        context 'with configured entry_request_scope' do
          before do
            Pageflow.config.public_entry_request_scope = lambda do |entries, request|
              entries.includes(:account).where(pageflow_accounts: {name: request.subdomain})
            end
          end

          it 'responds with success for matching entry' do
            account = create(:account, name: 'news')
            entry = create(:entry, :published, account: account)

            request.host = 'news.example.com'
            get(:show, id: entry)

            expect(response.status).to eq(200)
          end

          it 'responds with not found for non-matching entry' do
            entry = create(:entry, :published)

            request.host = 'news.example.com'
            get(:show, id: entry)

            expect(response.status).to eq(404)
          end
        end

        context 'with page parameter' do
          it 'renders social sharing meta tags for page' do
            entry = create(:entry, :published)
            storyline = create(:storyline, revision: entry.published_revision)
            chapter = create(:chapter, storyline: storyline)
            page = create(:page, configuration: {title: 'Shared page'}, chapter: chapter)

            get(:show, id: entry, page: page.perma_id)

            expect(response.body).to have_meta_tag
              .for_property('og:title')
              .with_content_including('Shared page')
          end
        end

        it 'sets X-Frame-Options header' do
          entry = create(:entry, :published)

          get(:show, id: entry)

          expect(response.headers).to include('X-Frame-Options')
        end

        context 'with embed parameter' do
          it 'does not set X-Frame-Options header' do
            entry = create(:entry, :published)

            get(:show, id: entry, embed: '1')

            expect(response.headers).not_to include('X-Frame-Options')
          end
        end

        context 'https mode' do
          let(:entry) { create(:entry, :published) }

          it 'redirects to https when https is enforced' do
            Pageflow.config.public_https_mode = :enforce

            get(:show, id: entry)

            expect(response).to redirect_to("https://test.host/entries/#{entry.to_param}")
          end

          it 'redirects to http when https is prevented' do
            Pageflow.config.public_https_mode = :prevent
            request.env['HTTPS'] = 'on'

            get(:show, id: entry)

            expect(response).to redirect_to("http://test.host/entries/#{entry.to_param}")
          end

          it 'stays on https when https mode is ignored' do
            Pageflow.config.public_https_mode = :ignore
            request.env['HTTPS'] = 'on'

            get(:show, id: entry)

            expect(response.status).to eq(200)
          end

          it 'stays on http when https mode is ignored' do
            Pageflow.config.public_https_mode = :ignore

            get(:show, id: entry)

            expect(response.status).to eq(200)
          end
        end
      end

      context 'with format css' do
        it 'responds with success for published entry' do
          entry = create(:entry, :published)

          get(:show, id: entry, format: 'css')

          expect(response.status).to eq(200)
        end

        it 'responds with success for entry published with password' do
          entry = create(:entry, :published_with_password, password: 'abc123abc')

          get(:show, id: entry, format: 'css')

          expect(response.status).to eq(200)
        end

        it 'responds with not found for not published entry' do
          entry = create(:entry)

          get(:show, id: entry, format: 'css')

          expect(response.status).to eq(404)
        end

        it 'includes image rules for image files' do
          entry = create(:entry, :published)
          image_file = create(:image_file, used_in: entry.published_revision)

          get(:show, id: entry, format: 'css')

          expect(response.body).to include(".image_#{image_file.id}")
          expect(response.body).to include("url('#{image_file.attachment.url(:large)}')")
        end

        it 'includes poster image rules for video files' do
          entry = create(:entry, :published)
          video_file = create(:video_file, used_in: entry.published_revision)

          get(:show, id: entry, format: 'css')

          expect(response.body).to include(".video_poster_#{video_file.id}")
          expect(response.body).to include("url('#{video_file.poster.url(:large)}')")
        end

        it 'includes panorama style group rules for image files' do
          entry = create(:entry, :published)
          image_file = create(:image_file, used_in: entry.published_revision)

          get(:show, id: entry, format: 'css')

          expect(response.body).to include(".image_panorama_#{image_file.id}")
          expect(response.body).to include("url('#{image_file.attachment.url(:panorama_large)}')")
        end
      end

      context 'with format json' do
        it 'responds with success for previewers of the entry' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          sign_in(user)
          get(:show, id: entry, format: 'json')

          expect(response.status).to eq(200)
        end

        it 'includes file usage ids in response' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)
          file = create(:image_file)
          usage = create(:file_usage, file: file, revision: entry.draft)

          sign_in(user)
          get(:show, id: entry, format: 'json')

          expect(json_response(path: [:image_files, 0, :usage_id])).to eq(usage.id)
        end

        it 'requires the signed in user to be previewer of the parent entry' do
          user = create(:user)
          entry = create(:entry)

          sign_in(user)
          get(:show, id: entry, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'requires authentication' do
          entry = create(:entry)

          get(:show, id: entry, format: 'json')

          expect(response.status).to eq(401)
        end
      end

      context 'with other known format' do
        it 'responds with not found' do
          get(:show, id: 1, format: 'png')

          expect(response.status).to eq(404)
        end
      end

      context 'with unknown format' do
        it 'responds with not found' do
          get(:show, id: 1, format: 'php')

          expect(response.status).to eq(404)
        end
      end
    end

    describe '#partials' do
      it 'reponds with success for previewers of the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user)
        get(:partials, id: entry)

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be previewer of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user)
        get(:partials, id: entry)

        expect(response).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:partials, id: entry)

        expect(response).to redirect_to(main_app.new_user_session_path)
      end

      it 'renders editor enabled widgets for entry' do
        widget_type =
          TestWidgetType.new(name: 'test_widget',
                             enabled_in_editor: true,
                             rendered: '<div class="test_widget"></div>')
        non_editor_widget_type =
          TestWidgetType.new(name: 'non_editor_widget',
                             enabled_in_editor: false,
                             rendered: '<div class="non_editor_widget"></div>')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
          config.widget_types.register(non_editor_widget_type)
        end

        user = create(:user)
        entry = create(:entry, with_previewer: user)
        create(:widget, subject: entry.draft, role: 'header', type_name: 'test_widget')
        create(:widget, subject: entry.draft, role: 'footer', type_name: 'non_editor_widget')

        sign_in(user)
        get(:partials, id: entry)

        expect(response.body).to have_selector('div.test_widget')
        expect(response.body).not_to have_selector('div.non_editor_widget')
      end

      it 'uses locale of entry' do
        widget_type =
          TestWidgetType.new(name: 'test_widget',
                             enabled_in_editor: true,
                             rendered: lambda { %'<div lang="#{I18n.locale}"></div>' })

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        user = create(:user)
        entry = create(:entry, with_previewer: user)
        create(:widget, subject: entry.draft, type_name: 'test_widget')
        entry.draft.update(locale: 'de')

        sign_in(user)
        get(:partials, id: entry)

        expect(response.body).to have_selector('div[lang=de]')
      end
    end

    describe '#page' do
      it 'redirects to entry path with page perma id anchor' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter)

        get(:page, id: entry, page_index: 0)

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'removes suffix appended with slash' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter)

        get(:page, id: entry, page_index: '0-some-title')

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'skips hash if page index is invalid' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, chapter: chapter)

        get(:page, id: entry, page_index: '100-not-there')

        expect(response).to redirect_to('/report')
      end

      context 'with configured entry_request_scope' do
        before do
          Pageflow.config.public_entry_request_scope = lambda do |entries, request|
            entries.includes(:account).where(pageflow_accounts: {name: request.subdomain})
          end
        end

        it 'responds with redirect for matching entry' do
          account = create(:account, name: 'news')
          entry = create(:entry, :published, account: account, title: 'report')
          storyline = create(:storyline, revision: entry.published_revision)
          chapter = create(:chapter, storyline: storyline)
          page = create(:page, chapter: chapter)

          request.host = 'news.example.com'
          get(:page, id: entry, page_index: 0)

          expect(response).to redirect_to("/report##{page.perma_id}")
        end

        it 'responds with not found for non-matching entry' do
          entry = create(:entry, :published)

          request.host = 'news.example.com'
          get(:page, id: entry, page_index: 0)

          expect(response.status).to eq(404)
        end
      end
    end
  end
end
