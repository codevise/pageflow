require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::FragmentInsertionsController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)

        post(:create,
             params: {
               entry_type: 'scrolled',
               entry_id: entry,
               chapter_id: chapter,
               fragment: {entry_id: entry.id, chapter_perma_id: chapter.perma_id}
             }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'copies sections of fragment into chapter' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        fragment = create_fragment(account:, section_count: 2)

        sign_in_and_lock(entry, user)
        post_insertion(entry:, chapter:, fragment:)

        expect(response.status).to eq(201)
        expect(chapter.sections.count).to eq(2)
      end

      it 'responds with sections and their content elements' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        fragment = create_fragment(account:)
        create(:content_element, :heading, section: fragment.sections.first)

        sign_in_and_lock(entry, user)
        post_insertion(entry:, chapter:, fragment:)

        expect(response.body).to include_json([{contentElements: [{typeName: 'heading'}]}])
      end

      it 'responds with not found for entry that is not a fragment library' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        fragment = create_fragment(account:, fragment_library: nil)

        sign_in_and_lock(entry, user)
        post_insertion(entry:, chapter:, fragment:)

        expect(response.status).to eq(404)
      end

      it 'responds with not found for library the user may not use files of' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        fragment = create_fragment(account: create(:account))

        sign_in_and_lock(entry, user)
        post_insertion(entry:, chapter:, fragment:)

        expect(response.status).to eq(404)
      end

      it 'responds with not found if fragments feature is disabled' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        chapter = create(:scrolled_chapter, revision: entry.draft)
        fragment = create_fragment(account:)

        sign_in_and_lock(entry, user)
        post_insertion(entry:, chapter:, fragment:)

        expect(response.status).to eq(404)
        expect(chapter.sections.count).to eq(0)
      end
    end

    def create_fragment(account:, section_count: 1, fragment_library: 'shared')
      library = create(:entry, type_name: 'scrolled', account:, fragment_library:)
      chapter = create(:scrolled_chapter, revision: library.draft)
      section_count.times { |position| create(:section, chapter:, position:) }
      chapter
    end

    def post_insertion(entry:, chapter:, fragment:)
      post(:create,
           params: {
             entry_type: 'scrolled',
             entry_id: entry,
             chapter_id: chapter,
             fragment: {
               entry_id: fragment.storyline.revision.entry_id,
               chapter_perma_id: fragment.perma_id
             }
           }, format: 'json')
    end

    def sign_in_and_lock(entry, user)
      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
