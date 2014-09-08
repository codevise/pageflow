require 'spec_helper'

module Pageflow
  describe Editor::EntriesController do
    routes { Engine.routes }
    render_views

    describe '#index' do
      it 'returns entries json' do
        user = create(:user)
        entry = DraftEntry.new(create(:entry), build_stubbed(:revision))
        allow(DraftEntry).to receive(:accessible_by).and_return([entry])

        sign_in(user)
        get(:index, :format => 'json')

        expect(json_response(:path => [0, 'id'])).to eq(entry.id)
      end

      it 'requires user to be signed in' do
        get :index, :format => 'json'

        expect(response.status).to eq(401)
      end
    end
  end
end
