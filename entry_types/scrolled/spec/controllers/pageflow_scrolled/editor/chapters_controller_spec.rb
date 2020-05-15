require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::ChaptersController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper
    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry)

        post(:create,
             params: {
               entry_id: entry,
               chapter: attributes_for(:scrolled_chapter)
             }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'succeeds for authorized user' do
        entry = create(:entry)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry,
               chapter: attributes_for(:scrolled_chapter)
             }, format: 'json')

        expect(response.status).to eq(201)
      end

      it 'allows setting the chapters configuration hash' do
        entry = create(:entry)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry,
               chapter: {
                 configuration: {title: 'A chapter title'}
               }
             }, format: 'json')

        chapter = Chapter.all_for_revision(entry.draft).first
        expect(chapter.configuration).to eq('title' => 'A chapter title')
      end

      it 'renders attributes as camel case' do
        entry = create(:entry)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {entry_id: entry, chapter: attributes_for(:scrolled_chapter)},
             format: 'json')
        expect(json_response(path: [:permaId])).to be_present
      end
    end

    describe '#update' do
      it 'allows updating the chapters configuration hash' do
        entry = create(:entry)
        chapter = create(:scrolled_chapter, revision: entry.draft)

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_id: entry,
                id: chapter,
                chapter: {
                  configuration: {title: 'A chapter title'}
                }
              }, format: 'json')

        expect(chapter.reload.configuration).to eq('title' => 'A chapter title')
        expect(response.status).to eq(204)
      end

      it 'does not allow updating a chapter from a different entry' do
        entry = create(:entry)
        create(:scrolled_chapter, revision: entry.draft)
        other_entry = create(:entry)
        chapter_in_other_entry = create(:scrolled_chapter, revision: other_entry.draft)

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_id: entry,
                id: chapter_in_other_entry,
                chapter: {
                  configuration: {title: 'another title'}
                }
              }, format: 'json')

        expect(response.status).to eq(404)
      end
    end

    describe '#order' do
      it 'updates position of chapters according to given params order' do
        entry = create(:entry)
        chapters = create_list(:scrolled_chapter, 2, revision: entry.draft)
        storyline = chapters.first.storyline

        authorize_for_editor_controller(entry)
        put(:order,
            params: {
              entry_id: entry,
              storyline_id: storyline,
              ids: [chapters.last.id, chapters.first.id]
            }, format: 'json')

        expect(chapters.last.reload.position).to eq(0)
        expect(chapters.first.reload.position).to eq(1)
      end

      it 'uses first storyline by default' do
        entry = create(:entry)
        chapters = create_list(:scrolled_chapter, 2, revision: entry.draft)

        authorize_for_editor_controller(entry)
        put(:order,
            params: {
              entry_id: entry,
              ids: [chapters.last.id, chapters.first.id]
            }, format: 'json')

        expect(chapters.last.reload.position).to eq(0)
        expect(chapters.first.reload.position).to eq(1)
      end

      it 'allows moving a chapter from one storyline to another within the same entry' do
        entry = create(:entry)
        chapter = create(:scrolled_chapter, revision: entry.draft)
        other_storyline = create(:scrolled_storyline, revision: entry.draft)

        authorize_for_editor_controller(entry)
        put(:order,
            params: {
              entry_id: entry,
              storyline_id: other_storyline,
              ids: [chapter.id]
            }, format: 'json')

        expect(chapter.reload.storyline).to eq(other_storyline)
      end

      it 'does not allow moving a chapter to a storyline of different entry' do
        entry = create(:entry)
        chapter = create(:scrolled_chapter, revision: entry.draft)
        other_entry = create(:entry)
        storyline_in_other_entry = create(:scrolled_storyline, revision: other_entry.draft)

        authorize_for_editor_controller(entry)
        put(:order,
            params: {
              entry_id: entry,
              storyline_id: storyline_in_other_entry,
              ids: [chapter.id]
            }, format: 'json')

        expect(response.status).to eq(404)
      end
    end

    describe '#destroy' do
      it 'deletes the chapter' do
        entry = create(:entry)
        chapter = create(:scrolled_chapter, revision: entry.draft)
        storyline = chapter.storyline

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_id: entry,
                 id: chapter
               }, format: 'json')

        expect(storyline).to have(0).chapters
        expect(response.status).to eq(204)
      end

      it 'does not allow deleting a chapter from a different entry' do
        entry = create(:entry)
        create(:scrolled_chapter, revision: entry.draft)
        other_entry = create(:entry)
        chapter_in_other_entry = create(:scrolled_chapter, revision: other_entry.draft)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_id: entry,
                 id: chapter_in_other_entry
               }, format: 'json')

        expect(response.status).to eq(404)
      end
    end
  end
end
