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
        theming = create(:theming, cname: 'pageflow.example.com', home_url: 'http://example.com/overview')

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
        theming = create(:theming, cname: 'pageflow.example.com')

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index)

        expect(response.status).to eq(404)
      end

      it 'uses configures theming_request_scope' do
        Pageflow.config.theming_request_scope = lambda do |themings, request|
          themings.where(id: Account.find_by_name!(request.subdomain).default_theming_id)
        end
        theming = create(:theming, home_url: 'http://example.com')
        account = create(:account, name: 'some-example', default_theming: theming)

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
        account = create(:account, name: 'some-example', default_theming: theming)

        request.env['HTTP_HOST'] = 'some-example.pageflow.io'
        get(:index)

        expect(response.status).to eq(404)
      end
    end

    describe '#edit' do
      it 'reponds with success for members of the entry' do
        user = create(:user)
        entry = create(:entry, :with_member => user)

        sign_in(user)
        get(:edit, :id => entry)

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user)
        get(:edit, :id => entry)

        expect(response).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:edit, :id => entry)

        expect(response).to redirect_to(main_app.new_user_session_path)
      end
    end

    describe '#update' do
      it 'responds with sucess' do
        user = create(:user)
        entry = create(:entry)
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:update, :id => entry, :entry => {:title => 'new', :credits => 'credits'}, :format => 'json')

        expect(response.status).to eq(204)
      end

      it 'updates title and credits in draft' do
        user = create(:user)
        entry = create(:entry)
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:update, :id => entry, :entry => {:title => 'new', :credits => 'credits'}, :format => 'json')

        expect(entry.draft.reload.title).to eq('new')
        expect(entry.draft.credits).to eq('credits')
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in user
        patch(:update, :id => entry, :entry => {}, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        patch(:update, :id => entry, :chapter => {}, :format => 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#show' do
      context 'with format html' do
        it 'responds with success for published entry' do
          entry = create(:entry, :published)

          get(:show, :id => entry)

          expect(response.status).to eq(200)
        end

        it 'responds with not found for not published entry' do
          entry = create(:entry)

          get(:show, :id => entry)

          expect(response.status).to eq(404)
        end

        it 'uses locale of entry' do
          entry = create(:entry, :published, published_revision_attributes: {locale: 'de'})

          get(:show, id: entry)

          expect(response.body).to have_selector('html[lang=de]')
        end

        it 'renders widgets for entry' do
          Pageflow.config.widget_types.register(TestWidgetType.new(:name => 'test_widget',
                                                                   :rendered => '<div class="test_widget"></div>'))
          entry = create(:entry, :published)
          create(:widget, :subject => entry.published_revision, :type_name => 'test_widget')

          get(:show, :id => entry)

          expect(response.body).to have_selector('div.test_widget')
        end

        it 'renders widgets head fragments for entry' do
          Pageflow.config.widget_types.register(TestWidgetType.new(:name => 'test_widget',
                                                                   :rendered_head_fragment => '<meta name="some_test" content="value">'))
          entry = create(:entry, :published)
          create(:widget, :subject => entry.published_revision, :type_name => 'test_widget')

          get(:show, :id => entry)

          expect(response.body).to have_selector('head meta[name=some_test]', :visible => false)
        end

        context 'with configured entry_request_scope' do
          before do
            Pageflow.config.public_entry_request_scope = lambda do |entries, request|
              entries.includes(:account).where(pageflow_accounts: {name: request.subdomain})
            end
          end

          it 'responds with success for matching entry' do
            account = create(:account, :name => 'news')
            entry = create(:entry, :published, :account => account)

            request.host = 'news.example.com'
            get(:show, :id => entry)

            expect(response.status).to eq(200)
          end

          it 'responds with not found for non matching entry' do
            entry = create(:entry, :published)

            request.host = 'news.example.com'
            get(:show, :id => entry)

            expect(response.status).to eq(404)
          end
        end
      end

      context 'with format css' do
        it 'responds with success for published entry' do
          entry = create(:entry, :published)

          get(:show, :id => entry, :format => 'css')

          expect(response.status).to eq(200)
        end

        it 'responds with not found for not published entry' do
          entry = create(:entry)

          get(:show, :id => entry, :format => 'css')

          expect(response.status).to eq(404)
        end
      end

      context 'with format json' do
        it 'responds with success for members of the entry' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          sign_in(user)
          get(:show, :id => entry, :format => 'json')

          expect(response.status).to eq(200)
        end

        it 'includes file usage ids in response' do
          user = create(:user)
          entry = create(:entry, :with_member => user)
          file = create(:image_file)
          usage = create(:file_usage, :file => file, :revision => entry.draft)

          sign_in(user)
          get(:show, :id => entry, :format => 'json')

          expect(json_response(:path => [:image_files, 0, :usage_id])).to eq(usage.id)
        end

        it 'requires the signed in user to be member of the parent entry' do
          user = create(:user)
          entry = create(:entry)

          sign_in(user)
          get(:show, :id => entry, :format => 'json')

          expect(response.status).to eq(403)
        end

        it 'requires authentication' do
          entry = create(:entry)

          get(:show, :id => entry, :format => 'json')

          expect(response.status).to eq(401)
        end
      end

      context 'with other known format' do
        it 'responds with not found' do
          get(:show, :id => 1, :format => 'png')

          expect(response.status).to eq(404)
        end
      end

      context 'with unknown format' do
        it 'responds with not found' do
          get(:show, :id => 1, :format => 'php')

          expect(response.status).to eq(404)
        end
      end
    end

    describe '#partials' do
      it 'reponds with success for members of the entry' do
        user = create(:user)
        entry = create(:entry, :with_member => user)

        sign_in(user)
        get(:partials, :id => entry)

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user)
        get(:partials, :id => entry)

        expect(response).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:partials, :id => entry)

        expect(response).to redirect_to(main_app.new_user_session_path)
      end

      it 'renders editor enabled widgets for entry' do
        Pageflow.config.widget_types.register(TestWidgetType.new(:name => 'test_widget',
                                                                 :enabled_in_editor => true,
                                                                 :rendered => '<div class="test_widget"></div>'))
        user = create(:user)
        entry = create(:entry, :with_member => user)
        create(:widget, :subject => entry.draft, :type_name => 'test_widget')

        sign_in(user)
        get(:partials, :id => entry)

        expect(response.body).to have_selector('div.test_widget')
      end

      it 'uses locale of entry' do
        Pageflow.config.widget_types.register(TestWidgetType.new(name: 'test_widget',
                                                                 enabled_in_editor: true,
                                                                 rendered: lambda { %'<div lang="#{I18n.locale}"></div>' }))
        user = create(:user)
        entry = create(:entry, with_member: user)
        create(:widget, :subject => entry.draft, :type_name => 'test_widget')

        sign_in(user)
        entry.draft.update(locale: 'de')
        get(:partials, id: entry)

        expect(response.body).to have_selector('div[lang=de]')
      end
    end

    describe '#page' do
      it 'redirects to entry path with page perma id anchor' do
        entry = create(:entry, :published, :title => 'report')
        chapter = create(:chapter, :revision => entry.published_revision)
        page = create(:page, :chapter => chapter)

        get(:page, :id => entry, :page_index => 0)

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'removes suffix appended with slash' do
        entry = create(:entry, :published, :title => 'report')
        chapter = create(:chapter, :revision => entry.published_revision)
        page = create(:page, :chapter => chapter)

        get(:page, :id => entry, :page_index => '0-some-title')

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'skips hash if page index is invalid' do
        entry = create(:entry, :published, :title => 'report')
        chapter = create(:chapter, :revision => entry.published_revision)
        page = create(:page, :chapter => chapter)

        get(:page, :id => entry, :page_index => '100-not-there')

        expect(response).to redirect_to("/report")
      end

      context 'with configured entry_request_scope' do
        before do
          Pageflow.config.public_entry_request_scope = lambda do |entries, request|
            entries.includes(:account).where(pageflow_accounts: {name: request.subdomain})
          end
        end

        it 'responds with redirect for matching entry' do
          account = create(:account, :name => 'news')
          entry = create(:entry, :published, :account => account, :title => 'report')
          chapter = create(:chapter, :revision => entry.published_revision)
          page = create(:page, :chapter => chapter)

          request.host = 'news.example.com'
          get(:page, :id => entry, :page_index => 0)

          expect(response).to redirect_to("/report##{page.perma_id}")
        end

        it 'responds with not found for non matching entry' do
          entry = create(:entry, :published)

          request.host = 'news.example.com'
          get(:page, :id => entry, :page_index => 0)

          expect(response.status).to eq(404)
        end
      end
    end
  end
end
