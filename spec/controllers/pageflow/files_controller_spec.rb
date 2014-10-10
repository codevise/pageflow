require 'spec_helper'

module Pageflow
  describe FilesController do
    describe '#show' do
      routes { Engine.routes }
      render_views

      it 'responds with success for video file of published entry' do
        entry = create(:entry, :published)
        video_file = create(:video_file, :entry => entry)
        create(:file_usage, :revision => entry.published_revision, :file => video_file)

        get(:show, :entry_id => entry, :collection_name => 'video_files', :id => video_file.id)

        expect(response.status).to eq(200)
      end

      it 'responds with success for audio file of published entry' do
        entry = create(:entry, :published)
        audio_file = create(:audio_file, :entry => entry)
        create(:file_usage, :revision => entry.published_revision, :file => audio_file)

        get(:show, :entry_id => entry, :collection_name => 'audio_files', :id => audio_file.id)

        expect(response.status).to eq(200)
      end

      it 'responds with not found for unpublished entry' do
        entry = create(:entry)
        video_file = create(:video_file, :entry => entry)
        create(:file_usage, :revision => entry.draft, :file => video_file)

        get(:show, :entry_id => entry, :collection_name => 'video_files', :id => video_file.id)

        expect(response.status).to eq(404)
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
          video_file = create(:video_file, :entry => entry, :used_in => entry.published_revision)

          request.host = 'news.example.com'
          get(:show, :entry_id => entry.id, :collection_name => 'video_files', :id => video_file.id)

          expect(response.status).to eq(200)
        end

        it 'responds with not found for non matching entry' do
          entry = create(:entry, :published)
          video_file = create(:video_file, :entry => entry, :used_in => entry.published_revision)

          request.host = 'news.example.com'
          get(:show, :entry_id => entry.id, :collection_name => 'video_files', :id => video_file.id)

          expect(response.status).to eq(404)
        end
      end
    end
  end
end
