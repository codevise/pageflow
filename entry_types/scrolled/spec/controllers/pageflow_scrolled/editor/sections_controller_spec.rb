require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::SectionsController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        chapter = create(:scrolled_chapter)
        entry = chapter.entry

        post(:create, params: {entry_id: entry.id,
                               chapter_id: chapter.id}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'succeeds for authorized user' do
        chapter = create(:scrolled_chapter)
        entry = chapter.entry

        authorize_for_editor_controller(entry)
        post(:create, params: {entry_id: entry.id,
                               chapter_id: chapter.id}, format: 'json')

        expect(response.status).to eq(201)
      end

      it 'allows setting the sections configuration hash' do
        chapter = create(:scrolled_chapter)
        entry = chapter.entry

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry.id,
               chapter_id: chapter.id,
               section: {
                 configuration: {title: 'A title'}
               }
             }, format: 'json')

        expect(chapter.sections.first.configuration).to eq('title' => 'A title')
      end
    end

    describe '#update' do
      it 'allows updating the sections configuration hash' do
        section = create(:section)
        entry = section.chapter.entry

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_id: entry.id,
                id: section,
                section: {
                  configuration: {title: 'A title'}
                }
              }, format: 'json')

        expect(section.reload.configuration).to eq('title' => 'A title')
      end
    end

    describe '#order' do
      it 'updates position of sections according to given params order' do
        chapter = create(:scrolled_chapter)
        entry = chapter.entry
        sections = create_list(:section, 2, chapter: chapter)

        authorize_for_editor_controller(entry)

        put(:order,
            params: {
              entry_id: entry.id,
              chapter_id: chapter,
              ids: [sections.first.id, sections.last.id]
            }, format: 'json')

        expect(sections.first.reload.position).to eq(0)
        expect(sections.last.reload.position).to eq(1)
      end

      it 'allows moving a section from one chapter to another within the same entry' do
        entry = create(:entry)
        revision = entry.draft
        chapter = create(:scrolled_chapter, revision: revision)
        section = create(:section, chapter: chapter)
        other_chapter = create(:scrolled_chapter, revision: revision)

        authorize_for_editor_controller(entry)

        put(:order,
            params: {
              entry_id: entry.id,
              chapter_id: other_chapter,
              ids: [section.id]
            }, format: 'json')

        expect(section.reload.chapter).to eq(other_chapter)
      end

      it 'does not allow moving a section to a chapter of another entry' do
        entry = create(:entry)
        revision = entry.draft
        other_entry = create(:entry)
        other_revision = other_entry.draft
        chapter = create(:scrolled_chapter, revision: revision)
        other_chapter = create(:scrolled_chapter, revision: other_revision)

        section = create(:section, chapter: chapter)

        authorize_for_editor_controller(other_entry)

        put(:order,
            params: {
              entry_id: other_entry.id,
              chapter_id: other_chapter,
              ids: [section.id]
            }, format: 'json')

        expect(response).to be_not_found
      end
    end

    describe '#destroy' do
      it 'deletes the section' do
        section = create(:section)
        chapter = section.chapter
        entry = chapter.entry

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_id: entry.id,
                 id: section
               }, format: 'json')

        expect(chapter).to have(0).sections
      end
    end
  end
end
