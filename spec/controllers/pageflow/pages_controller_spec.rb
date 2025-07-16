require 'spec_helper'

module Pageflow
  describe PagesController do
    routes { Engine.routes }
    render_views

    describe '#create' do
      it 'can write to nested configuration hash' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               chapter_id: chapter,
               page: {
                 template: 'background_image',
                 configuration: {title: 'Welcome'}
               }
             },
             format: 'json')

        expect(chapter.pages.first.configuration).to eq('title' => 'Welcome')
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)

        sign_in(user, scope: :user)
        post(:create, params: {chapter_id: chapter, page: attributes_for(:valid_page)},
                      format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        chapter = create(:chapter)

        post(:create, params: {chapter_id: chapter, page: attributes_for(:valid_page)},
                      format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#update' do
      it 'requires edit lock' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)
        page = create(:page, chapter:, configuration: {})

        sign_in(user, scope: :user)
        patch(:update, params: {id: page, page: {}}, format: 'json')

        expect(response.status).to eq(409)
      end

      it 'can write to nested configuration hash' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)
        page = create(:page, chapter:, configuration: {})

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {
                id: page,
                page: {
                  configuration: {title: 'Welcome'}
                }
              },
              format: 'json')

        expect(page.reload.configuration).to eq('title' => 'Welcome')
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)
        page = create(:page, chapter:)

        sign_in(user, scope: :user)
        patch(:update, params: {id: page, page: attributes_for(:valid_page)}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        page = create(:page)

        patch(:update, params: {id: page, page: attributes_for(:valid_page)}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#order' do
      it 'updates position of pages according to order' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)
        pages = create_list(:page, 2, chapter:)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        put(:order, params: {chapter_id: chapter, ids: [pages.first.id, pages.last.id]})

        expect(pages.first.reload.position).to eq(0)
        expect(pages.last.reload.position).to eq(1)
      end

      it 'moves page from same entry to chapter' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        other_storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline:)
        other_chapter = create(:chapter, storyline: other_storyline)
        page = create(:page, chapter:)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        put(:order, params: {chapter_id: other_chapter, ids: [page.id]})

        expect(page.reload.chapter).to eq(other_chapter)
      end

      it 'cannot move page to chapter of other entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_editor: user)
        storyline = create(:storyline, revision: entry.draft)
        chapter = create(:chapter, storyline:)
        storyline_of_other_entry = create(:storyline, revision: other_entry.draft)
        chapter_of_other_entry = create(:chapter, storyline: storyline_of_other_entry)
        page = create(:page, chapter:)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, other_entry)
        put(:order, params: {chapter_id: chapter_of_other_entry, ids: [page.id]})

        expect(response).to be_not_found
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)
        page = create(:page, chapter:)

        sign_in(user, scope: :user)
        put(:order, params: {chapter_id: page.chapter, ids: [page.id]}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        page = create(:page)

        put(:order, params: {chapter_id: page.chapter, id: [page.id]}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'responds with success' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)
        page = create(:page, chapter:, configuration: {})

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        delete(:destroy,
               params: {
                 id: page
               },
               format: 'json')

        expect(chapter.reload).to have(0).pages
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        chapter = create(:chapter, in_main_storyline_of: entry.draft)
        page = create(:page, chapter:)

        sign_in(user, scope: :user)
        delete(:destroy, params: {id: page}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        page = create(:page)

        delete(:destroy, params: {id: page}, format: 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
