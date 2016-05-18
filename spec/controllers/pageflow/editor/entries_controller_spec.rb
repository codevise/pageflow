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
        get(:index, format: 'json')

        expect(json_response(path: [0, 'id'])).to eq(entry.id)
      end

      it 'requires user to be signed in' do
        get :index, format: 'json'

        expect(response.status).to eq(401)
      end
    end

    describe '#seed' do
      it 'reponds with success for members of the entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        get(:seed, id: entry, format: 'json')

        expect(response.status).to eq(200)
        expect { JSON.parse(response.body) }.not_to raise_error
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user)
        get(:seed, id: entry, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:seed, id: entry, format: 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
