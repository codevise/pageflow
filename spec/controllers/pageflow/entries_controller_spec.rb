require 'spec_helper'

module Pageflow
  describe EntriesController do
    routes { Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    # Specs for #index and #show can be found in
    # spec/requests/entries_index_request_spec.rb and
    # spec/requests/entries_show_request_spec.rb

    describe '#manifest' do
      it 'responds with JSON provided by entry type' do
        pageflow_configure do |config|
          TestEntryType.register(config,
                                 name: 'test',
                                 web_app_manifest: lambda do |entry|
                                   {"name": entry.title}.to_json
                                 end)
        end

        entry = create(:entry, :published, type_name: 'test', title: 'Some title')

        get(:manifest, params: {id: entry}, format: 'webmanifest')

        expect(response.status).to eq(200)
        expect(response.body).to include_json(name: 'Some title')
      end

      it 'responds with not found if entry type does not have web_app_manifest' do
        pageflow_configure do |config|
          TestEntryType.register(config,
                                 name: 'test')
        end

        entry = create(:entry, :published, type_name: 'test', title: 'Some title')

        get(:manifest, params: {id: entry}, format: 'webmanifest')

        expect(response.status).to eq(404)
      end

      it 'responds with not found for not published entry' do
        entry = create(:entry)

        get(:stylesheet, params: {id: entry}, format: 'webmanifest')

        expect(response.status).to eq(404)
      end
    end

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
          image_file = create_used_file(:image_file, entry:)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.body).to include(".image_#{image_file.perma_id}")
          expect(response.body).to include("url('#{image_file.attachment.url(:large)}')")
        end

        it 'includes poster image rules for video files' do
          entry = PublishedEntry.new(create(:entry, :published))
          video_file = create_used_file(:video_file, entry:)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.body).to include(".video_poster_#{video_file.perma_id}")
          expect(response.body).to include("url('#{video_file.poster.url(:large)}')")
        end

        it 'includes panorama style group rules for image files' do
          entry = PublishedEntry.new(create(:entry, :published))
          image_file = create_used_file(:image_file, entry:)

          get(:stylesheet, params: {id: entry}, format: 'css')

          expect(response.body).to include(".image_panorama_#{image_file.perma_id}")
          expect(response.body).to include("url('#{image_file.attachment.url(:panorama_large)}')")
        end
      end
    end

    describe '#page' do
      it 'redirects to entry path with page perma id anchor' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline:)
        page = create(:page, chapter:)

        get(:page, params: {id: entry, page_index: 0})

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'removes suffix appended with slash' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline:)
        page = create(:page, chapter:)

        get(:page, params: {id: entry, page_index: '0-some-title'})

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'skips hash if page index is invalid' do
        entry = create(:entry, :published, title: 'report')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline:)
        create(:page, chapter:)

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
          entry = create(:entry, :published, account:, title: 'report')
          storyline = create(:storyline, revision: entry.published_revision)
          chapter = create(:chapter, storyline:)
          page = create(:page, chapter:)

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
