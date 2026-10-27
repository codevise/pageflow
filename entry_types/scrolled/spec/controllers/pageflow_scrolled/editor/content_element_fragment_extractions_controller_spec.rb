require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::ContentElementFragmentExtractionsController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        content_element = create(:content_element, revision: entry.draft)

        post_extraction(entry:, content_elements: [content_element])

        expect(response.status).to eq(401)
      end

      it 'copies content elements into fragment of library' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        section = create(:section, revision: entry.draft)
        heading = create(:content_element, :heading, section:, position: 0)
        text_block = create(:content_element, :text_block, section:, position: 1)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, content_elements: [heading, text_block], title: 'Intro')

        fragment = Chapter.all_for_revision(find_library(account).draft).first
        expect(response.status).to eq(201)
        expect(fragment.configuration).to include('title' => 'Intro',
                                                  'fragment' => {'kind' => 'contentElements'})
        expect(fragment.sections.first.content_elements.map(&:type_name))
          .to eq(%w[heading textBlock])
      end

      it 'copies content elements in document order' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        first_section = create(:section, chapter:, position: 0)
        second_section = create(:section, chapter:, position: 1)
        text_block = create(:content_element, :text_block, section: second_section)
        heading = create(:content_element, :heading, section: first_section)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, content_elements: [text_block, heading])

        expect(ContentElement.all_for_revision(find_library(account).draft).map(&:type_name))
          .to eq(%w[heading textBlock])
      end

      it 'does not let user who may not edit library add fragment' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        content_element = create(:content_element, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, content_elements: [content_element])

        expect(response.status).to eq(403)
        expect(find_library(account)).to be_nil
      end

      it 'responds with not found for content element of other entry' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')
        other_entry = create(:entry, type_name: 'scrolled', account:)
        content_element = create(:content_element, revision: entry.draft)
        other_content_element = create(:content_element, revision: other_entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, content_elements: [content_element, other_content_element])

        expect(response.status).to eq(404)
        expect(find_library(account)).to be_nil
      end

      it 'responds with not found without content elements' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_feature: 'fragments')

        sign_in_and_lock(entry, user)
        post_extraction(entry:, content_elements: [])

        expect(response.status).to eq(404)
        expect(find_library(account)).to be_nil
      end

      it 'responds with not found if fragments feature is disabled' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, type_name: 'scrolled', account:)
        content_element = create(:content_element, revision: entry.draft)

        sign_in_and_lock(entry, user)
        post_extraction(entry:, content_elements: [content_element])

        expect(response.status).to eq(404)
        expect(find_library(account)).to be_nil
      end
    end

    def find_library(account)
      Pageflow::Entry.find_by(account:, fragment_library: 'shared')
    end

    def post_extraction(entry:, content_elements:, title: nil)
      post(:create,
           params: {
             entry_type: 'scrolled',
             entry_id: entry,
             content_element_ids: content_elements.map(&:id),
             title:
           }.compact, format: 'json')
    end

    def sign_in_and_lock(entry, user)
      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
