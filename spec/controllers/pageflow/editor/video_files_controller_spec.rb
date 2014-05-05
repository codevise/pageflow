require 'spec_helper'

module Pageflow
  describe Editor::VideoFilesController do
    routes { Engine.routes }
    render_views

    include_examples 'encoded files controller' do
      let(:model_name) { :video_file }
      let(:failed_trait) { :encoding_failed }
      let(:attachment) { :attachment_on_filesystem }

      def fixture_upload
        fixture_file_upload(Engine.root.join('spec', 'fixtures', 'video.mp4'), 'video/mp4')
      end
    end

    describe '#retry' do
      it 'succeeds if file is encoded' do
        user = create(:user)
        entry = create(:entry, :with_member => user)
        file = create(model_name, :encoded, :used_in => entry.draft)

        sign_in user
        aquire_edit_lock(user, entry)
        post :retry, :id => file, :format => 'json'

        expect(response.status).to eq(201)
      end
    end
  end
end
