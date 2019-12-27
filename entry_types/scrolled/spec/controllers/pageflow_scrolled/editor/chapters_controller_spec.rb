require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::ChaptersController, type: :controller do
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

        expect(response.status).to eq(201)
      end

      it 'allows setting the chapters configuration hash' do
        entry = create(:entry)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry.id,
               chapter: {
                 configuration: {title: 'A chapter title'}
               }
             }, format: 'json')

        main_storyline = Storyline.all_for_revision(entry.draft).first
        expect(main_storyline.chapters.first.configuration).to eq('title' => 'A chapter title')
      end
    end

    describe '#update' do
      it 'allows updating the chapters configuration hash' do
        chapter = create(:scrolled_chapter)
        entry = chapter.entry

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_id: entry.id,
                id: chapter,
                chapter: {
                  configuration: {title: 'A chapter title'}
                }
              }, format: 'json')

        expect(chapter.reload.configuration).to eq('title' => 'A chapter title')
      end
    end

    describe '#order' do
      it 'updates position of chapters according to given params order' do
        entry = create(:entry)
        chapters = create_list(:scrolled_chapter, 2, revision: entry.draft)

        authorize_for_editor_controller(entry)

        put(:order,
            params: {
              entry_id: entry.id,
              ids: [chapters.last.id, chapters.first.id]
            }, format: 'json')

        expect(chapters.last.reload.position).to eq(0)
        expect(chapters.first.reload.position).to eq(1)
      end
    end

    describe '#destroy' do
      it 'deletes the chapter' do
        entry = create(:entry)
        revision = entry.draft
        chapter = create(:scrolled_chapter, revision: revision)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_id: entry.id,
                 id: chapter
               }, format: 'json')

        main_storyline = Storyline.all_for_revision(revision).first
        expect(main_storyline).to have(0).chapters
      end
    end
  end
end
