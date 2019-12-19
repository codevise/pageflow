require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::SectionsController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry)

        post(:create, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'succeeds for authorized user' do
        entry = create(:entry)

        authorize_for_editor_controller(entry)
        post(:create, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(204)
      end
    end
  end
end
