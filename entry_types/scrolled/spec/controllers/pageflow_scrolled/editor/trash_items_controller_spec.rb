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
  end
end
