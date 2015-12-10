require 'spec_helper'

module Pageflow
  describe StorylinesController do
    routes { Pageflow::Engine.routes }

    describe '#create' do
      it 'creates storyline in draft' do
        user = create(:user)
        entry = create(:entry)
        create(:membership, entry: entry, user: user)

        expect {
          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create,
               entry_id: entry, storyline: attributes_for(:valid_storyline), format: 'json')
        }.to change { entry.draft.storylines.count }.by(1)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in user
        post(:create, entry_id: entry, storyline: attributes_for(:valid_storyline), format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        post(:create, entry_id: entry, storyline: attributes_for(:valid_storyline), format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#update' do
      it 'updates storyline' do
        user = create(:user)
        entry = create(:entry)
        storyline = create(:storyline, revision: entry.draft)
        create(:membership, entry: entry, user: user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:update, id: storyline, storyline: attributes_for(:valid_storyline, configuration: {some: 'updated value'}), format: 'json')

        expect(storyline.reload.configuration['some']).to eq('updated value')
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        storyline = create(:storyline)

        sign_in user
        patch(:update, id: storyline, storyline: attributes_for(:valid_storyline), format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        storyline = create(:storyline)

        patch(:update, id: storyline, storyline: attributes_for(:valid_storyline), format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#order' do
      it 'responds with success for signed in member of entry' do
        user = create(:user)
        entry = create(:entry)
        storylines = create_list(:storyline, 2, revision: entry.draft)
        create(:membership, entry: entry, user: user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:order, entry_id: entry, ids: [storylines.first.id, storylines.last.id], format: 'json')

        expect(response.status).to eq(204)
      end

      it 'updates position of storylines in draft according to order' do
        user = create(:user)
        entry = create(:entry)
        storylines = create_list(:storyline, 2, revision: entry.draft)
        create(:membership, entry: entry, user: user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:order, entry_id: entry, ids: [storylines.first.id, storylines.last.id], format: 'json')

        expect(storylines.first.reload.position).to eq(0)
        expect(storylines.last.reload.position).to eq(1)
      end

      it 'requires signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)
        storyline = create(:storyline, revision: entry.draft)

        sign_in user
        patch(:order, entry_id: entry, ids: [storyline.id], format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        storyline = create(:storyline)

        patch(:order, entry_id: storyline.entry, ids: [storyline.id], format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'destroys storyline' do
        user = create(:user)
        entry = create(:entry)
        storyline = create(:storyline, revision: entry.draft)
        create(:membership, entry: entry, user: user)

        sign_in user
        aquire_edit_lock(user, entry)

        expect {
          delete(:destroy, id: storyline, format: 'json')
        }.to change { entry.draft.storylines.count }.by(-1)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        storyline = create(:storyline)

        sign_in user
        delete(:destroy, id: storyline, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        storyline = create(:storyline)

        delete(:destroy, id: storyline, format: 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
