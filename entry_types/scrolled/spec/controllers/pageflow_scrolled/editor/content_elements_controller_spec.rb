require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::ContentElementsController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper
    routes { PageflowScrolled::Engine.routes }

    describe '#batch' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: []
             }, format: 'json', as: :json)

        expect(response.status).to eq(401)
      end

      it 'allows ordering content elements referenced by id' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_elements = create_list(:content_element, 2, section:)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {id: content_elements.first.id},
                 {id: content_elements.last.id}
               ]
             }, format: 'json', as: :json)

        expect(content_elements.first.reload.position).to eq(0)
        expect(content_elements.last.reload.position).to eq(1)
      end

      it 'allows moving content elements to different section' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        other_section = create(:section, revision: entry.draft)
        content_element = create(:content_element, :text_block, section:)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: other_section,
               content_elements: [
                 {id: content_element.id}
               ]
             }, format: 'json', as: :json)

        expect(content_element.reload.section).to eq(other_section)
      end

      it 'does not allow moving content elements to different entry' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        other_entry = create(:entry, type_name: 'scrolled')
        other_section = create(:section, revision: other_entry.draft)
        content_element = create(:content_element, section:)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: other_section,
               content_elements: [
                 {id: content_element.id}
               ]
             }, format: 'json', as: :json)

        expect(response.status).to eq(404)
      end

      it 'allows setting content element configuration hashes' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, section:)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {id: content_element.id, configuration: {some: 'value'}}
               ]
             }, format: 'json', as: :json)

        expect(content_element.reload.configuration).to eq('some' => 'value')
      end

      it 'does not change configuration hash if not passed' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element,
                                 section:,
                                 configuration: {some: 'value'})

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {id: content_element.id}
               ]
             }, format: 'json', as: :json)

        expect(content_element.reload.configuration).to eq('some' => 'value')
      end

      it 'allows creating content elements' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {typeName: 'textBlock', configuration: {some: 'value'}}
               ]
             }, format: 'json', as: :json)

        expect(section.content_elements.first)
          .to have_attributes(type_name: 'textBlock',
                              configuration: {'some' => 'value'})
      end

      it 'deletes content elements marked by _delete flag' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_elements = create_list(:content_element, 2, section:)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {id: content_elements.first.id, _delete: true},
                 {id: content_elements.last.id}
               ]
             }, format: 'json', as: :json)

        expect(section.content_elements.map(&:id)).to eq([content_elements.last.id])
      end

      it 'responds with array of objects containging content element ids and perma ids' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {typeName: 'textBlock', configuration: {some: 'value'}}
               ]
             }, format: 'json', as: :json)

        expect(response.body).to include_json([
                                                {
                                                  id: section.content_elements.first.id,
                                                  permaId: section.content_elements.first.perma_id
                                                }
                                              ])
      end

      it 'does not create content elements if id is unknown' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {id: 42, configuration: {some: 'value'}}
               ]
             }, format: 'json', as: :json)

        expect(response.status).to eq(404)
      end

      it 'rolls back other changes if one id is unknown' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {typeName: 'textBlock', configuration: {some: 'value'}},
                 {id: 42, configuration: {other: 'value'}}
               ]
             }, format: 'json', as: :json)

        expect(section.content_elements.count).to eq(0)
      end

      it 'allows performing a mix of update, create and delete operations' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_elements = create_list(:content_element,
                                       3,
                                       section:,
                                       configuration: {some: 'value'})

        authorize_for_editor_controller(entry)
        post(:batch,
             params: {
               entry_type: 'scrolled',
               entry_id: entry.id,
               section_id: section.id,
               content_elements: [
                 {id: content_elements.first.id, configuration: {new: 'value'}},
                 {typeName: 'textBlock', configuration: {other: 'value'}},
                 {id: content_elements.second.id, _delete: true},
                 {id: content_elements.third.id}
               ]
             }, format: 'json', as: :json)

        expect(section.content_elements)
          .to match([
                      an_object_having_attributes(id: content_elements.first.id,
                                                  configuration: {'new' => 'value'}),
                      an_object_having_attributes(type_name: 'textBlock',
                                                  configuration: {'other' => 'value'}),
                      an_object_having_attributes(id: content_elements.third.id,
                                                  configuration: {'some' => 'value'})
                    ])
        expect(response.body).to include_json([
                                                {
                                                  id: section.content_elements.first.id,
                                                  permaId: section.content_elements.first.perma_id
                                                },
                                                {
                                                  id: section.content_elements.second.id,
                                                  permaId: section.content_elements.second.perma_id
                                                },
                                                {
                                                  id: section.content_elements.third.id,
                                                  permaId: section.content_elements.third.perma_id
                                                }
                                              ])
      end
    end

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        post(:create,
             params: {
               entry_type: 'scrolled',
               entry_id: entry,
               section_id: section,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'succeeds for authorized user' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_type: 'scrolled',
               entry_id: entry,
               section_id: section,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')

        expect(response.status).to eq(201)
      end

      it 'allows setting the content elements configuration hash' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_type: 'scrolled',
               entry_id: entry,
               section_id: section,
               content_element: {
                 configuration: {children: 'some content'}
               }
             }, format: 'json')

        expect(section.content_elements.first.configuration).to eq('children' => 'some content')
      end

      it 'allows setting the content elements type name' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_type: 'scrolled',
               entry_id: entry,
               section_id: section,
               content_element: {
                 type_name: 'textBlock'
               }
             }, format: 'json')

        expect(section.content_elements.first.type_name).to eq('textBlock')
      end

      it 'can handle camel case attributes' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_type: 'scrolled',
               entry_id: entry,
               section_id: section,
               content_element: {
                 typeName: 'textBlock'
               }
             }, format: 'json')

        expect(section.content_elements.first.type_name).to eq('textBlock')
      end

      it 'renders attributes as camel case' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)

        authorize_for_editor_controller(entry)
        post(:create,
             params: {
               entry_type: 'scrolled',
               entry_id: entry,
               section_id: section,
               content_element: attributes_for(:content_element, :text_block)
             }, format: 'json')
        expect(json_response(path: [:permaId])).to be_present
      end
    end

    describe '#update' do
      it 'allows updating the content elements configuration hash' do
        entry = create(:entry, type_name: 'scrolled')
        content_element = create(:content_element, :text_block, revision: entry.draft)

        authorize_for_editor_controller(entry)
        patch(:update,
              params: {
                entry_type: 'scrolled',
                entry_id: entry,
                id: content_element,
                content_element: {
                  configuration: {children: 'some content'}
                }
              }, format: 'json')

        expect(content_element.reload.configuration).to eq('children' => 'some content')
        expect(response.status).to eq(204)
      end

      it 'does not allow updating a content element from a different entry' do
        entry = create(:entry, type_name: 'scrolled')
        other_entry = create(:entry, type_name: 'scrolled')
        content_element_in_other_entry = create(:content_element, revision: other_entry.draft)

        authorize_for_editor_controller(entry)

        patch(:update,
              params: {
                entry_type: 'scrolled',
                entry_id: entry,
                id: content_element_in_other_entry,
                content_element: {
                  configuration: {children: 'some other content'}
                }
              }, format: 'json')

        expect(response.status).to eq(404)
      end
    end

    describe '#order' do
      it 'updates position of content elements according to given params order' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_elements = create_list(:content_element, 2, :text_block, section:)

        authorize_for_editor_controller(entry)

        put(:order,
            params: {
              entry_type: 'scrolled',
              entry_id: entry,
              section_id: section,
              ids: [content_elements.first.id, content_elements.last.id]
            }, format: 'json')

        expect(content_elements.first.reload.position).to eq(0)
        expect(content_elements.last.reload.position).to eq(1)
      end

      it 'does not allow moving a content element to a section of a different entry' do
        entry = create(:entry, type_name: 'scrolled')
        content_element = create(:content_element, revision: entry.draft)
        other_entry = create(:entry, type_name: 'scrolled')
        section_in_other_entry = create(:section, revision: other_entry.draft)

        authorize_for_editor_controller(entry)
        put(:order,
            params: {
              entry_type: 'scrolled',
              entry_id: entry,
              section_id: section_in_other_entry,
              ids: [content_element.id]
            }, format: 'json')

        expect(response.status).to eq(404)
      end
    end

    describe '#destroy' do
      it 'deletes the content element' do
        entry = create(:entry, type_name: 'scrolled')
        section = create(:section, revision: entry.draft)
        content_element = create(:content_element, :text_block, section:)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_type: 'scrolled',
                 entry_id: entry,
                 id: content_element
               }, format: 'json')

        expect(section).to have(0).content_elements
        expect(response.status).to eq(204)
      end

      it 'does not allow deleting a content element from a different entry' do
        entry = create(:entry, type_name: 'scrolled')
        other_entry = create(:entry, type_name: 'scrolled')
        content_element_in_other_entry = create(:content_element, revision: other_entry.draft)

        authorize_for_editor_controller(entry)
        delete(:destroy,
               params: {
                 entry_type: 'scrolled',
                 entry_id: entry,
                 id: content_element_in_other_entry
               }, format: 'json')

        expect(response.status).to eq(404)
      end
    end
  end
end
