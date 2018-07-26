require 'spec_helper'

module Pageflow
  describe ChaptersController do
    routes { Pageflow::Engine.routes }

    describe '#create' do
      it 'creates chapter in storyline' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)

        expect do
          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create,
               params: {
                 storyline_id: storyline,
                 chapter: attributes_for(:valid_chapter)
               },
               format: 'json')
        end.to change { entry.draft.chapters.count }.by(1)
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account: account)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        post(:create,
             params: {
             storyline_id: storyline,
             chapter: attributes_for(:valid_chapter)
             },
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)
        storyline = create(:storyline, revision: entry.draft)

        post(:create,
             params: {
             storyline_id: storyline,
             chapter: attributes_for(:valid_chapter)
             },
             format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#scaffold' do
      it 'creates chapter in storyline' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)

        expect do
          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:scaffold,
               params: {
               storyline_id: storyline,
               chapter: attributes_for(:valid_chapter)
               },
               format: 'json')
        end.to change { entry.draft.chapters.count }.by(1)
      end

      it 'creates page inside new chapter' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:scaffold,
             params: {
             storyline_id: storyline,
             chapter: attributes_for(:valid_chapter)
             },
             format: 'json')

        expect(storyline.chapters.last.pages.count).to eq(1)
      end

      it 'renders chapter and page attributes' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:scaffold,
             params: {
             storyline_id: storyline,
             chapter: attributes_for(:valid_chapter)
             },
             format: 'json')

        expect(json_response(path: [:chapter, :id])).to be_present
        expect(json_response(path: [:page, :id])).to be_present
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account: account)
        storyline = create(:storyline, revision: entry.draft)

        sign_in(user, scope: :user)
        post(:scaffold,
             params: {
             storyline_id: storyline,
             chapter: attributes_for(:valid_chapter)
             },
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)
        storyline = create(:storyline, revision: entry.draft)

        post(:scaffold,
             params: {
             storyline_id: storyline,
             chapter: attributes_for(:valid_chapter)
             },
             format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#update' do
      it 'updates chapter' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline: storyline, title: 'old')

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {
              id: chapter,
              chapter: attributes_for(:valid_chapter, title: 'new')
              },
              format: 'json')

        expect(chapter.reload.title).to eq('new')
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account: account)
        storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline: storyline)

        sign_in(user, scope: :user)
        patch(:update, params: {id: chapter, chapter: attributes_for(:valid_chapter)}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        chapter = create(:chapter)

        patch(:update, params: {id: chapter, chapter: attributes_for(:valid_chapter)}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#order' do
      it 'responds with success for signed in editor of entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        chapters = create_list(:chapter, 2, storyline: storyline)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        put(:order,
            params: {
            storyline_id: storyline,
            ids: [chapters.first.id, chapters.last.id]
            },
            format: 'json')

        expect(response.status).to eq(204)
      end

      it 'updates position of chapters in draft according to order' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        chapters = create_list(:chapter, 2, storyline: storyline)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        put(:order,
            params: {
            storyline_id: storyline,
            ids: [chapters.first.id, chapters.last.id]
            },
            format: 'json')

        expect(chapters.first.reload.position).to eq(0)
        expect(chapters.last.reload.position).to eq(1)
      end

      it 'moves chapter from same entry to storyline' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        other_storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline: storyline)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        put(:order, params: {storyline_id: other_storyline, ids: [chapter.id]})

        expect(chapter.reload.storyline).to eq(other_storyline)
      end

      it 'cannot move chapter to storyline of other entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline: storyline)
        storyline_of_other_entry = create(:storyline, revision: other_entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, other_entry)
        put(:order, params: {storyline_id: storyline_of_other_entry, ids: [chapter.id]})

        expect(response).to be_not_found
      end

      it 'requires signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account: account)
        storyline = create(:storyline, revision: entry.draft)
        chapters = create_list(:chapter, 2, storyline: storyline)

        sign_in(user, scope: :user)
        put(:order,
            params: {
              storyline_id: storyline,
              ids: [chapters.first.id, chapters.last.id]
            },
            format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        storyline = create(:storyline)
        chapter = create(:chapter, storyline: storyline)

        put(:order, params: {storyline_id: storyline, ids: [chapter.id]}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'destroys chapter' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline: storyline, title: 'old')

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        delete(:destroy, params: {id: chapter.id}, format: 'json')

        expect(entry.reload_draft).to have(0).chapters
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account: account)
        storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline: storyline)

        sign_in(user, scope: :user)
        delete(:destroy, params: {id: chapter}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        chapter = create(:chapter)

        delete(:destroy, params: {id: chapter}, format: 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
