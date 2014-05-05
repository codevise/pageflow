require 'spec_helper'

module Pageflow
  describe ChaptersController do
    routes { Pageflow::Engine.routes }

    describe '#create' do
      it 'creates chapter in draft' do
        user = create(:user)
        entry = create(:entry)
        create(:membership, :entry => entry, :user => user)

        expect {
          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, :entry_id => entry, :chapter => attributes_for(:valid_chapter), :format => 'json')
        }.to change { entry.draft.chapters.count }.by(1)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in user
        post(:create, :entry_id => entry, :chapter => attributes_for(:valid_chapter), :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        post(:create, :entry_id => entry, :chapter => attributes_for(:valid_chapter), :format => 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#update' do
      it 'updates chapter' do
        user = create(:user)
        entry = create(:entry)
        chapter = create(:chapter, :revision => entry.draft, :title => 'old')
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:update, :id => chapter, :chapter => attributes_for(:valid_chapter, :title => 'new'), :format => 'json')

        expect(chapter.reload.title).to eq('new')
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        chapter = create(:chapter)

        sign_in user
        patch(:update, :id => chapter, :chapter => attributes_for(:valid_chapter), :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        chapter = create(:chapter)

        patch(:update, :id => chapter, :chapter => attributes_for(:valid_chapter), :format => 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#order' do
      it 'responds with success for signed in member of entry' do
        user = create(:user)
        entry = create(:entry)
        chapters = create_list(:chapter, 2, :revision => entry.draft)
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:order, :entry_id => entry, :ids => [chapters.first.id, chapters.last.id], :format => 'json')

        expect(response.status).to eq(204)
      end

      it 'updates position of chapters in draft according to order' do
        user = create(:user)
        entry = create(:entry)
        chapters = create_list(:chapter, 2, :revision => entry.draft)
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:order, :entry_id => entry, :ids => [chapters.first.id, chapters.last.id], :format => 'json')

        expect(chapters.first.reload.position).to eq(0)
        expect(chapters.last.reload.position).to eq(1)
      end

      it 'requires signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)
        chapters = create_list(:chapter, 2, :revision => entry.draft)

        sign_in user
        patch(:order, :entry_id => entry, :ids => [chapters.first.id, chapters.last.id], :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        chapter = create(:chapter)

        patch(:order, :entry_id => chapter.entry, :ids => [chapter.id], :format => 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'destroys chapter' do
        user = create(:user)
        entry = create(:entry)
        chapter = create(:chapter, :revision => entry.draft, :title => 'old')
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        delete(:destroy, :id => chapter, :format => 'json')

        expect(entry.draft).to have(0).chapters
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        chapter = create(:chapter)

        sign_in user
        delete(:destroy, :id => chapter, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        chapter = create(:chapter)

        delete(:destroy, :id => chapter, :format => 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
