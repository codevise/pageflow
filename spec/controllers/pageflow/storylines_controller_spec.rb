require 'spec_helper'

module Pageflow
  describe StorylinesController do
    routes { Pageflow::Engine.routes }

    describe '#create' do
      it 'responds with success for editors of the storyline-entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        expect {
          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create,
               params: {entry_id: entry, storyline: attributes_for(:valid_storyline)}, format: 'json')
        }.to change { entry.draft.storylines.count }.by(1)
      end

      it 'responds with failure for previewers of the respective account and below' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)

        post(:create, params: {entry_id: entry, storyline: attributes_for(:valid_storyline)},
                      format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#scaffold' do
      render_views

      it 'creates storyline in draft' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        expect {
          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:scaffold,
               params: {entry_id: entry, storyline: attributes_for(:valid_storyline)}, format: 'json')
        }.to change { entry.draft.storylines.count }.by(1)
      end

      it 'creates chapter inside new storyline' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:scaffold,
             params: {entry_id: entry, storyline: attributes_for(:valid_storyline)}, format: 'json')
        storyline = entry.draft.storylines.reorder('id').last

        expect(storyline.chapters).not_to be_empty
      end

      it 'renders storyline and chapter attributes' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:scaffold,
             params: {entry_id: entry, storyline: attributes_for(:valid_storyline)}, format: 'json')

        expect(json_response(path: [:storyline, :id])).to be_present
        expect(json_response(path: [:chapter, :id])).to be_present
      end

      context 'with depth parameter "page"' do
        render_views

        it 'creates page inside new chapter' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:scaffold,
               params: {
                 entry_id: entry,
                 storyline: attributes_for(:valid_storyline, position: 1),
                 depth: 'page'
               },
               format: 'json')
          storyline = entry.draft.storylines.reorder('id').last
          chapter = storyline.chapters.last

          expect(chapter.pages).not_to be_empty
        end

        it 'renders page attributes' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:scaffold,
               params: {
                 entry_id: entry,
                 storyline: attributes_for(:valid_storyline),
                 depth: 'page'
               },
               format: 'json')

          expect(json_response(path: [:page, :id])).to be_present
        end
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)

        sign_in(user, scope: :user)
        post(:scaffold,
             params: {
               entry_id: entry,
               storyline: attributes_for(:valid_storyline)
             },
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        post(:scaffold,
             params: {
               entry_id: entry,
               storyline: attributes_for(:valid_storyline)
             },
             format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#update' do
      it 'updates storyline' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {
                id: storyline,
                storyline: attributes_for(:valid_storyline, configuration: {some: 'updated value'})
              },
              format: 'json')

        expect(storyline.reload.configuration['some']).to eq('updated value')
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        patch(:update, params: {id: storyline, storyline: attributes_for(:valid_storyline)},
                       format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        storyline = create(:storyline)

        patch(:update, params: {id: storyline, storyline: attributes_for(:valid_storyline)},
                       format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#order' do
      it 'responds with success for signed in editor of entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storylines = create_list(:storyline, 2, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        put(:order, params: {entry_id: entry, ids: [storylines.first.id,
                                                    storylines.last.id]}, format: 'json')

        expect(response.status).to eq(204)
      end

      it 'updates position of storylines in draft according to order' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storylines = create_list(:storyline, 2, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        put(:order, params: {entry_id: entry, ids: [storylines.first.id,
                                                    storylines.last.id]}, format: 'json')

        expect(storylines.first.reload.position).to eq(0)
        expect(storylines.last.reload.position).to eq(1)
      end

      it 'requires signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        put(:order, params: {entry_id: entry, ids: [storyline.id]}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        storyline = create(:storyline)

        put(:order, params: {entry_id: storyline.entry, ids: [storyline.id]}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'destroys storyline' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        expect {
          delete(:destroy, params: {id: storyline}, format: 'json')
        }.to change { entry.draft.storylines.count }.by(-1)
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        delete(:destroy, params: {id: storyline}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        storyline = create(:storyline)

        delete(:destroy, params: {id: storyline}, format: 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
