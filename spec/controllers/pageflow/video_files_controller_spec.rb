require 'spec_helper'

module Pageflow
  describe VideoFilesController do
    describe '#show' do
      routes { Engine.routes }
      render_views

      it 'responds with success for published entry' do
        entry = create(:entry, :published)
        video_file = create(:video_file, :entry => entry)
        create(:file_usage, :revision => entry.published_revision, :file => video_file)

        get(:show, :entry_id => entry, :id => video_file.id)

        expect(response.status).to eq(200)
      end

      it 'responds with not found for unpublished entry' do
        entry = create(:entry)
        video_file = create(:video_file, :entry => entry)
        create(:file_usage, :revision => entry.draft, :file => video_file)

        get(:show, :entry_id => entry, :id => video_file.id)

        expect(response.status).to eq(404)
      end
    end
  end
end
