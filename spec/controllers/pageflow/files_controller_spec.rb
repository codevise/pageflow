require 'spec_helper'

module Pageflow
  describe FilesController do
    describe '#show' do
      routes { Engine.routes }
      render_views

      it 'responds with success for video file of published entry' do
        entry = create(:entry, :published)
        video_file = create(:video_file, entry:)
        create(:file_usage, revision: entry.published_revision, file: video_file)

        get(:show,
            params: {entry_id: entry, collection_name: 'video_files', id: video_file.id})

        expect(response.status).to eq(200)
      end

      it 'responds with success for audio file of published entry' do
        entry = create(:entry, :published)
        audio_file = create(:audio_file, entry:)
        create(:file_usage, revision: entry.published_revision, file: audio_file)

        get(:show,
            params: {entry_id: entry, collection_name: 'audio_files', id: audio_file.id})

        expect(response.status).to eq(200)
      end

      it 'responds with not found for unpublished entry' do
        entry = create(:entry)
        video_file = create(:video_file, entry:)
        create(:file_usage, revision: entry.draft, file: video_file)

        get(:show,
            params: {entry_id: entry, collection_name: 'video_files', id: video_file.id})

        expect(response.status).to eq(404)
      end

      it 'responds with forbidden for entry published with password' do
        entry = create(:entry, :published_with_password, password: 'abc123abc')
        video_file = create(:video_file, entry:)
        create(:file_usage, revision: entry.published_revision, file: video_file)

        get(:show, params: {entry_id: entry, collection_name: 'video_files', id: video_file.id})

        expect(response.status).to eq(401)
      end

      it 'responds with success for password protected entry when correct password is given' do
        entry = create(:entry, :published_with_password, password: 'abc123abc')
        video_file = create(:video_file, entry:)
        create(:file_usage, revision: entry.published_revision, file: video_file)

        request.env['HTTP_AUTHORIZATION'] =
          ActionController::HttpAuthentication::Basic.encode_credentials('Pageflow', 'abc123abc')
        get(:show, params: {entry_id: entry, collection_name: 'video_files', id: video_file.id})

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
          entry = create(:entry, :published, account:)
          video_file = create(:video_file, entry:, used_in: entry.published_revision)

          request.host = 'news.example.com'
          get(:show,
              params: {entry_id: entry.id, collection_name: 'video_files', id: video_file.id})

          expect(response.status).to eq(200)
        end

        it 'responds with not found for non matching entry' do
          entry = create(:entry, :published)
          video_file = create(:video_file, entry:, used_in: entry.published_revision)

          request.host = 'news.example.com'
          get(:show,
              params: {entry_id: entry.id, collection_name: 'video_files', id: video_file.id})

          expect(response.status).to eq(404)
        end
      end

      context 'https mode' do
        let(:entry) { create(:entry, :published) }
        let(:video_file) { create(:video_file, entry:, used_in: entry.published_revision) }

        it 'redirects to https when https is enforced' do
          Pageflow.config.public_https_mode = :enforce

          get(:show,
              params: {entry_id: entry.id, collection_name: 'video_files', id: video_file.id})

          expect(response).to redirect_to("https://test.host/#{entry.id}/videos/#{video_file.id}")
        end

        it 'redirects to http when https is prevented' do
          Pageflow.config.public_https_mode = :prevent
          request.env['HTTPS'] = 'on'

          get(:show,
              params: {entry_id: entry.id, collection_name: 'video_files', id: video_file.id})

          expect(response).to redirect_to("http://test.host/#{entry.id}/videos/#{video_file.id}")
        end

        it 'stays on https when https mode is ignored' do
          Pageflow.config.public_https_mode = :ignore
          request.env['HTTPS'] = 'on'

          get(:show,
              params: {entry_id: entry.id, collection_name: 'video_files', id: video_file.id})

          expect(response.status).to eq(200)
        end

        it 'stays on http when https mode is ignored' do
          Pageflow.config.public_https_mode = :ignore

          get(:show,
              params: {entry_id: entry.id, collection_name: 'video_files', id: video_file.id})

          expect(response.status).to eq(200)
        end
      end
    end
  end
end
