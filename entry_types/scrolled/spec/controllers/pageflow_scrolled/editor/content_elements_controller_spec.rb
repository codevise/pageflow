require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::ContentElementsController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        section = create(:section)
        entry = section.chapter.entry

        post(:create,
             params: {
               entry_id: entry.id,
               section_id: section,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'succeeds for authorized user' do
        section = create(:section)
        entry = section.chapter.entry

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry.id,
               section_id: section.id,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')

        expect(response.status).to eq(201)
      end

      it 'allows setting the content elements configuration hash' do
        section = create(:section)
        entry = section.chapter.entry

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry.id,
               section_id: section.id,
               content_element: {
                 configuration: {children: 'some content'}
               }
             }, format: 'json')

        expect(section.content_elements.first.configuration).to eq('children' => 'some content')
      end

      it 'allows setting the content elements type name' do
        section = create(:section)
        entry = section.chapter.entry

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry.id,
               section_id: section.id,
               content_element: {
                 type_name: 'textBlock'
               }
             }, format: 'json')

        expect(section.content_elements.first.type_name).to eq('textBlock')
      end
    end

    describe '#update' do
      it 'allows updating the content elements configuration hash' do
        content_element = create(:content_element, :text_block)
        section = content_element.section
        entry = section.chapter.entry

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_id: entry.id,
                section_id: section.id,
                id: content_element,
                content_element: {
                  configuration: {children: 'some content'}
                }
              }, format: 'json')

        expect(content_element.reload.configuration).to eq('children' => 'some content')
      end
    end

    describe '#order' do
      it 'updates position of content elements according to given params order' do
        section = create(:section)
        entry = section.chapter.entry
        content_elements = create_list(:content_element, 2, :text_block, section: section)

        authorize_for_editor_controller(entry)

        put(:order,
            params: {
              entry_id: entry.id,
              section_id: section.id,
              ids: [content_elements.first.id, content_elements.last.id]
            }, format: 'json')

        expect(content_elements.first.reload.position).to eq(0)
        expect(content_elements.last.reload.position).to eq(1)
      end
    end

    describe '#destroy' do
      it 'deletes the content element' do
        content_element = create(:content_element, :text_block)
        section = content_element.section
        entry = section.chapter.entry

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_id: entry.id,
                 section_id: section.id,
                 id: content_element
               }, format: 'json')

        expect(section).to have(0).content_elements
      end
    end
  end
end
