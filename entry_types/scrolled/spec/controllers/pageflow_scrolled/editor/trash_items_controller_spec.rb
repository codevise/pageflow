require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::TrashItemsController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper
    include ActiveSupport::Testing::TimeHelpers

    routes { PageflowScrolled::Engine.routes }

    describe '#index' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')

        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'lists trashed sections with origin and trash time' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        section = create(:section, chapter:, position: 3)
        content_element = create(:content_element, section:)
        travel_to(Time.utc(2026, 10, 1, 12)) do
          Trash.new(entry.draft).add_section(section)
        end

        authorize_for_editor_controller(entry)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json(
          [
            {
              id: section.reload.chapter_id,
              kind: 'section',
              originPermaId: chapter.perma_id,
              originPosition: 3,
              trashedAt: '2026-10-01T12:00:00Z',
              sections: [
                {
                  id: section.id,
                  permaId: section.perma_id,
                  contentElements: [{id: content_element.id}]
                }
              ]
            }
          ]
        )
      end

      it 'lists trashed chapters with title' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft,
                                            configuration: {'title' => 'Intro'})
        section = create(:section, chapter:)
        Trash.new(entry.draft).add_chapter(chapter)

        authorize_for_editor_controller(entry)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json(
          [
            {
              id: chapter.id,
              kind: 'chapter',
              title: 'Intro',
              sections: [{id: section.id}]
            }
          ]
        )
      end

      it 'lists newest items first' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        first_section = create(:section, chapter:)
        second_section = create(:section, chapter:)
        trash = Trash.new(entry.draft)
        trash.add_section(first_section)
        trash.add_section(second_section)

        authorize_for_editor_controller(entry)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body).map { |e| e['sections'].first['id'] })
          .to eq([second_section.id, first_section.id])
      end

      it 'renders empty list if nothing has been trashed' do
        entry = create(:entry, type_name: 'scrolled')

        authorize_for_editor_controller(entry)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to eq([])
      end
    end

    describe '#restore' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        Trash.new(entry.draft).add_section(section)

        post(:restore,
             params: {entry_type: 'scrolled', entry_id: entry, id: section.reload.chapter_id},
             format: 'json')

        expect(response.status).to eq(401)
      end

      it 'restores section and renders it with content elements' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        section = create(:section, chapter:)
        content_element = create(:content_element, section:)
        Trash.new(entry.draft).add_section(section)

        authorize_for_editor_controller(entry)
        post(:restore,
             params: {entry_type: 'scrolled', entry_id: entry, id: section.reload.chapter_id},
             format: 'json')

        expect(response.status).to eq(200)
        expect(response.body).to include_json(
          id: section.id,
          permaId: section.perma_id,
          chapterId: chapter.id,
          contentElements: [{id: content_element.id, permaId: content_element.perma_id}]
        )
      end

      it 'restores chapter and renders it with sections and content elements' do
        entry = create(:entry, type_name: 'scrolled')
        storyline = Storyline.all_for_revision(entry.draft).first
        chapter = create(:scrolled_chapter, storyline:, configuration: {'title' => 'Intro'})
        section = create(:section, chapter:)
        content_element = create(:content_element, section:)
        Trash.new(entry.draft).add_chapter(chapter)

        authorize_for_editor_controller(entry)
        post(:restore,
             params: {entry_type: 'scrolled', entry_id: entry, id: chapter.id},
             format: 'json')

        expect(response.status).to eq(200)
        expect(response.body).to include_json(
          id: chapter.id,
          permaId: chapter.perma_id,
          storylineId: storyline.id,
          configuration: {title: 'Intro'},
          sections: [
            {id: section.id, contentElements: [{id: content_element.id}]}
          ]
        )
        expect(JSON.parse(response.body)['configuration']).not_to have_key('trash')
      end

      it 'restores content elements and renders them' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)
        Trash.new(entry.draft).add_content_elements([content_element],
                                                    origin_section: section,
                                                    origin_position: 0)

        authorize_for_editor_controller(entry)
        post(:restore,
             params: {entry_type: 'scrolled', entry_id: entry,
                      id: content_element.reload.section.chapter_id},
             format: 'json')

        expect(response.status).to eq(200)
        expect(response.body).to include_json(
          [{id: content_element.id, permaId: content_element.perma_id,
            sectionId: section.id, position: 0}]
        )
      end

      it 'responds with unprocessable entity if no chapter is left' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        origin_chapter = section.chapter
        Trash.new(entry.draft).add_section(section)
        origin_chapter.destroy

        authorize_for_editor_controller(entry)
        post(:restore,
             params: {entry_type: 'scrolled', entry_id: entry, id: section.reload.chapter_id},
             format: 'json')

        expect(response.status).to eq(422)
      end

      it 'does not allow restoring trash items of other entries' do
        entry = create(:entry, type_name: 'scrolled')
        other_entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: other_entry.draft)
        Trash.new(other_entry.draft).add_section(section)

        authorize_for_editor_controller(entry)
        post(:restore,
             params: {entry_type: 'scrolled', entry_id: entry, id: section.reload.chapter_id},
             format: 'json')

        expect(response.status).to eq(404)
      end
    end

    describe '#destroy' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        Trash.new(entry.draft).add_section(section)

        delete(:destroy,
               params: {entry_type: 'scrolled', entry_id: entry, id: section.reload.chapter_id},
               format: 'json')

        expect(response.status).to eq(401)
      end

      it 'permanently deletes trash item with its content' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)
        other_section = create(:section, revision: entry.draft)
        trash = Trash.new(entry.draft)
        trash.add_section(section)
        trash.add_section(other_section)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {entry_type: 'scrolled', entry_id: entry, id: section.reload.chapter_id},
               format: 'json')

        expect(response.status).to eq(204)
        expect(trash.items.map(&:id)).to eq([other_section.reload.chapter_id])
        expect(Section.exists?(section.id)).to eq(false)
        expect(ContentElement.exists?(content_element.id)).to eq(false)
      end

      it 'does not allow deleting trash items of other entries' do
        entry = create(:entry, type_name: 'scrolled')
        other_entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: other_entry.draft)
        Trash.new(other_entry.draft).add_section(section)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {entry_type: 'scrolled', entry_id: entry, id: section.reload.chapter_id},
               format: 'json')

        expect(response.status).to eq(404)
        expect(Section.exists?(section.id)).to eq(true)
      end
    end

    describe '#empty' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')

        delete(:empty, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'permanently deletes all trash items' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        chapter = create(:scrolled_chapter, revision: entry.draft)
        trash = Trash.new(entry.draft)
        trash.add_section(section)
        trash.add_chapter(chapter)

        authorize_for_editor_controller(entry)
        delete(:empty, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.status).to eq(204)
        expect(trash.items).to be_empty
        expect(Chapter.exists?(chapter.id)).to eq(false)
        expect(Section.exists?(section.id)).to eq(false)
      end

      it 'keeps content of other entries' do
        entry = create(:entry, type_name: 'scrolled')
        other_entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: other_entry.draft)
        Trash.new(other_entry.draft).add_section(section)

        authorize_for_editor_controller(entry)
        delete(:empty, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(Section.exists?(section.id)).to eq(true)
      end
    end
  end
end
