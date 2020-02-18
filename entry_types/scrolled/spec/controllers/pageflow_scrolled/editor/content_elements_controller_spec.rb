require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::ContentElementsController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper
    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)

        post(:create,
             params: {
               entry_id: entry,
               section_id: section,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'succeeds for authorized user' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry,
               section_id: section,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')

        expect(response.status).to eq(201)
      end

      it 'allows setting the content elements configuration hash' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry,
               section_id: section,
               content_element: {
                 configuration: {children: 'some content'}
               }
             }, format: 'json')

        expect(section.content_elements.first.configuration).to eq('children' => 'some content')
      end

      it 'allows setting the content elements type name' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry,
               section_id: section,
               content_element: {
                 type_name: 'textBlock'
               }
             }, format: 'json')

        expect(section.content_elements.first.type_name).to eq('textBlock')
      end

      it 'can handle camel case attributes' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry,
               section_id: section,
               content_element: {
                 typeName: 'textBlock'
               }
             }, format: 'json')

        expect(section.content_elements.first.type_name).to eq('textBlock')
      end

      it 'renders attributes as camel case' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_id: entry,
               section_id: section,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')
        expect(json_response(path: [:permaId])).to be_present
      end
    end

    describe '#update' do
      it 'allows updating the content elements configuration hash' do
        entry = create(:entry)
        content_element = create(:content_element, :text_block, revision: entry.draft)

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_id: entry,
                id: content_element,
                content_element: {
                  configuration: {children: 'some content'}
                }
              }, format: 'json')

        expect(content_element.reload.configuration).to eq('children' => 'some content')
      end

      it 'does not allow updating a content element from a different entry' do
        entry = create(:entry)
        other_entry = create(:entry)
        content_element_in_other_entry = create(:content_element, revision: other_entry.draft)

        authorize_for_editor_controller(entry)

        patch(:update,
              params: {
                entry_id: entry,
                id: content_element_in_other_entry,
                content_element: {
                  configuration: {children: 'some other content'}
                }
              }, format: 'json')

        expect(response.status).to eq(404)
      end

      it 'renders attributes as camel case' do
        entry = create(:entry)
        content_element = create(:content_element, :text_block, revision: entry.draft)

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_id: entry,
                id: content_element,
                content_element: attributes_for(:content_element, :text_block)
              }, format: 'json')
        expect(json_response(path: [:permaId])).to be_present
      end
    end

    describe '#order' do
      it 'updates position of content elements according to given params order' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)
        content_elements = create_list(:content_element, 2, :text_block, section: section)

        authorize_for_editor_controller(entry)

        put(:order,
            params: {
              entry_id: entry,
              section_id: section,
              ids: [content_elements.first.id, content_elements.last.id]
            }, format: 'json')

        expect(content_elements.first.reload.position).to eq(0)
        expect(content_elements.last.reload.position).to eq(1)
      end

      it 'does not allow moving a content element to a section of a different entry' do
        entry = create(:entry)
        content_element = create(:content_element, revision: entry.draft)
        other_entry = create(:entry)
        section_in_other_entry = create(:section, revision: other_entry.draft)

        authorize_for_editor_controller(entry)
        put(:order,
            params: {
              entry_id: entry,
              section_id: section_in_other_entry,
              ids: [content_element.id]
            }, format: 'json')

        expect(response.status).to eq(404)
      end
    end

    describe '#destroy' do
      it 'deletes the content element' do
        entry = create(:entry)
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, :text_block, section: section)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_id: entry,
                 id: content_element
               }, format: 'json')

        expect(section).to have(0).content_elements
      end

      it 'does not allow deleting a content element from a different entry' do
        entry = create(:entry)
        other_entry = create(:entry)
        content_element_in_other_entry = create(:content_element, revision: other_entry.draft)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_id: entry,
                 id: content_element_in_other_entry
               }, format: 'json')

        expect(response.status).to eq(404)
      end

      it 'renders attributes as camel case' do
        entry = create(:entry)
        content_element = create(:content_element, :text_block, revision: entry.draft)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {entry_id: entry, id: content_element},
               format: 'json')
        expect(json_response(path: [:permaId])).to be_present
      end
    end
  end
end
