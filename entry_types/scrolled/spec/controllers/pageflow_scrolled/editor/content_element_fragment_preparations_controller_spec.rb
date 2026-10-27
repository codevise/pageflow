require 'spec_helper'
require 'pageflow/editor_controller_test_helper'
require 'pageflow/used_file_test_helper'

module PageflowScrolled
  RSpec.describe Editor::ContentElementFragmentPreparationsController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper
    include UsedFileTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#create' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')
        fragment = create_fragment(account: entry.account)

        post_preparation(entry:, fragment:)

        expect(response.status).to eq(401)
      end

      it 'responds with content elements of fragment' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        fragment = create_fragment(account:)
        create(:content_element, :heading,
               section: fragment.sections.first,
               configuration: {'children' => 'Hello'})

        sign_in_and_lock(entry, user)
        post_preparation(entry:, fragment:)

        expect(response.status).to eq(201)
        expect(response.body)
          .to include_json([{typeName: 'heading', configuration: {children: 'Hello'}}])
      end

      it 'responds with empty configuration for content element without configuration' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        fragment = create_fragment(account:)
        create(:content_element, :heading, section: fragment.sections.first, configuration: {})

        sign_in_and_lock(entry, user)
        post_preparation(entry:, fragment:)

        expect(JSON.parse(response.body)).to eq([{'typeName' => 'heading', 'configuration' => {}}])
      end

      it 'uses files of fragment in entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        fragment = create_fragment(account:)
        image_file = create_used_file(
          :image_file,
          entry: Pageflow::DraftEntry.new(fragment.storyline.revision.entry)
        )
        create(:content_element,
               section: fragment.sections.first,
               type_name: 'inlineImage',
               configuration: {'id' => image_file.perma_id})

        sign_in_and_lock(entry, user)
        post_preparation(entry:, fragment:)

        expect(entry.draft.reload.image_files).to eq([image_file.to_model])
      end

      it 'does not create content elements' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        fragment = create_fragment(account:)
        create(:content_element, :heading, section: fragment.sections.first)

        sign_in_and_lock(entry, user)

        expect { post_preparation(entry:, fragment:) }
          .not_to(change { ContentElement.count })
      end

      it 'responds with not found for library the user may not use files of' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        fragment = create_fragment(account: create(:account))

        sign_in_and_lock(entry, user)
        post_preparation(entry:, fragment:)

        expect(response.status).to eq(404)
      end

      it 'responds with not found if fragments feature is disabled' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        fragment = create_fragment(account:)

        sign_in_and_lock(entry, user)
        post_preparation(entry:, fragment:)

        expect(response.status).to eq(404)
      end
    end

    def create_fragment(account:)
      library = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
      chapter = create(:scrolled_chapter,
                       revision: library.draft,
                       configuration: {'fragment' => {'kind' => 'contentElements'}})
      create(:section, chapter:)
      chapter
    end

    def post_preparation(entry:, fragment:)
      post(:create,
           params: {
             entry_type: 'scrolled',
             entry_id: entry,
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
