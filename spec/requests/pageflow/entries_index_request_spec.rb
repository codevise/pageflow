require 'spec_helper'

module Pageflow
  describe 'Entries Index', type: :request do
    before :all do
      Pageflow.config.editor_route_constraint = ->(_request) { false }
      Rails.application.reload_routes!
    end

    after :all do
      Pageflow.config.editor_route_constraint = nil
      Rails.application.reload_routes!
    end

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

    describe '#index' do
      it 'redirects to home url of site with matching cname' do
        create(:site, cname: 'pageflow.example.com', home_url: 'http://example.com/overview')

        get('/', params: {}, headers: {'HTTP_HOST' => 'pageflow.example.com'})

        expect(response).to redirect_to('http://example.com/overview')
      end

      it 'renders site root entry if present' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               site:,
               type_name: 'test',
               title: 'Root Story',
               permalink_attributes: {slug: '', allow_root_path: true})

        get('/', params: {}, headers: {'HTTP_HOST' => 'pageflow.example.com'})

        expect(response.status).to eq(200)
        expect(response.body)
          .to include('Root Story published rendered by entry type frontend app')
      end

      it 'responds with not found if no site matches cname' do
        get('/', params: {}, headers: {'HTTP_HOST' => 'unknown.example.com'})

        expect(response.status).to eq(404)
      end

      it 'responds with not found if site with matching cname does not have home_url' do
        create(:site, cname: 'pageflow.example.com')

        get('/', params: {}, headers: {'HTTP_HOST' => 'pageflow.example.com'})

        expect(response.status).to eq(404)
      end

      it 'uses configures site_request_scope' do
        Pageflow.config.site_request_scope = lambda do |sites, request|
          sites.where(id: Account.find_by_name!(request.subdomain).default_site_id)
        end
        site = create(:site, home_url: 'http://example.com')
        create(:account, name: 'some-example', default_site: site)

        get('/', params: {}, headers: {'HTTP_HOST' => 'some-example.pageflow.io'})

        expect(response).to redirect_to('http://example.com')
      end

      it 'responds with not found if site_request_scope raises RecordNotFound' do
        Pageflow.config.site_request_scope = lambda do |sites, request|
          sites.where(id: Account.find_by_name!(request.subdomain).default_site_id)
        end

        get('/', params: {}, headers: {'HTTP_HOST' => 'none.pageflow.io'})

        expect(response.status).to eq(404)
      end

      it 'responds with not found if site_request_scope returns site with blank home_url' do
        Pageflow.config.site_request_scope = lambda do |sites, request|
          sites.where(id: Account.find_by_name!(request.subdomain).default_site_id)
        end
        site = create(:site)
        create(:account, name: 'some-example', default_site: site)

        get('/', params: {}, headers: {'HTTP_HOST' => 'some-example.pageflow.io'})

        expect(response.status).to eq(404)
      end
    end
  end
end
