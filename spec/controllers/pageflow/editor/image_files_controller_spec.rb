require 'spec_helper'

module Pageflow
  describe Editor::ImageFilesController do
    routes { Engine.routes }
    render_views

    include_examples 'encoded files controller' do
      let(:model_name) { :image_file }
      let(:failed_trait) { :failed }
      let(:attachment) { :unprocessed_attachment }

      def fixture_upload
        fixture_file_upload(Engine.root.join('spec', 'fixtures', 'image.jpg'), 'image/jpeg')
      end
    end

    describe '#retry' do
      it 'fails if image file is processed' do
        user = create(:user)
        entry = create(:entry, :with_member => user)
        image_file = create(:image_file, :used_in => entry.draft)

        sign_in user
        aquire_edit_lock(user, entry)
        post :retry, :id => image_file, :format => 'json'

        expect(response.status).to eq(400)
      end
    end
  end
end
