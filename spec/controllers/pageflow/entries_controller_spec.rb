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

        sign_in(user, scope: :user)
        get(:edit, params: {id: entry})

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        get(:edit, params: {id: entry})

        expect(response).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:edit, params: {id: entry})

        expect(response).to redirect_to(main_app.new_user_session_path)
      end

      it 'renders entry type specific head fragment' do
        renderer = double('renderer')
        pageflow_configure do |config|
          TestEntryType.register(config,
                                 name: 'test',
                                 editor_fragment_renderer: renderer)
        end
        user = create(:user)
        entry = create(:entry, with_editor: user, type_name: 'test')

        allow(renderer)
          .to receive(:head_fragment).and_return('<script src="/test/editor.js">'.html_safe)

        sign_in(user, scope: :user)
        get(:edit, params: {id: entry})

        expect(response.body).to have_selector('script[src^="/test/editor.js"]',
                                               visible: false)
      end

      it 'renders entry type specific body fragment' do
        renderer = double('renderer').as_null_object
        pageflow_configure do |config|
          TestEntryType.register(config,
                                 name: 'test',
                                 editor_fragment_renderer: renderer)
        end
        user = create(:user)
        entry = create(:entry, with_editor: user, type_name: 'test')

        allow(renderer)
          .to receive(:body_fragment).and_return('<div class="seed"></div>'.html_safe)

        sign_in(user, scope: :user)
        get(:edit, params: {id: entry})

        expect(response.body).to have_selector('div.seed')
      end
    end

    # Specs for #show can be found in
    # spec/requests/entries_show_request_spec.rb

    describe '#stylesheet' do
      context 'with format css' do
        include UsedFileTestHelper

        it 'responds with success for published entry' do
          entry = create(:entry, :published)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.status).to eq(200)
        end

        it 'responds with success for entry published with password' do
          entry = create(:entry, :published_with_password, password: 'abc123abc')

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.status).to eq(200)
        end

        it 'responds with not found for not published entry' do
          entry = create(:entry)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.status).to eq(404)
        end

        it 'includes image rules for image files' do
          entry = PublishedEntry.new(create(:entry, :published))
          image_file = create_used_file(:image_file, entry: entry)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.body).to include(".image_#{image_file.perma_id}")
          expect(response.body).to include("url('#{image_file.attachment.url(:large)}')")
        end

        it 'includes poster image rules for video files' do
          entry = PublishedEntry.new(create(:entry, :published))
          video_file = create_used_file(:video_file, entry: entry)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.body).to include(".video_poster_#{video_file.perma_id}")
          expect(response.body).to include("url('#{video_file.poster.url(:large)}')")
        end

        it 'includes panorama style group rules for image files' do
          entry = PublishedEntry.new(create(:entry, :published))
          image_file = create_used_file(:image_file, entry: entry)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.body).to include(".image_panorama_#{image_file.perma_id}")
          expect(response.body).to include("url('#{image_file.attachment.url(:panorama_large)}')")
        end
      end
    end

    describe '#partials' do
      it 'reponds with success for previewers of the entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        get(:partials, params: {id: entry})

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be previewer of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user, scope: :user)
        get(:partials, params: {id: entry})

        expect(response).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:partials, params: {id: entry})

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

        sign_in(user, scope: :user)
        get(:partials, params: {id: entry})

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

        sign_in(user, scope: :user)
        get(:partials, params: {id: entry})

        expect(response.body).to have_selector('div[lang=de]')
      end
    end

    describe '#page' do
      it 'redirects to entry path with page perma id anchor' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter)

        get(:page, params: {id: entry, page_index: 0})

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'removes suffix appended with slash' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter)

        get(:page, params: {id: entry, page_index: '0-some-title'})

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'skips hash if page index is invalid' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, chapter: chapter)

        get(:page, params: {id: entry, page_index: '100-not-there'})

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
          get(:page, params: {id: entry, page_index: 0})

          expect(response).to redirect_to("/report##{page.perma_id}")
        end

        it 'responds with not found for non-matching entry' do
          entry = create(:entry, :published)

          request.host = 'news.example.com'
          get(:page, params: {id: entry, page_index: 0})

          expect(response.status).to eq(404)
        end
      end
    end
  end
end
