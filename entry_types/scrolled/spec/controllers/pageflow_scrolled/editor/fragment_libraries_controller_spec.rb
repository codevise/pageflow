require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::FragmentLibrariesController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#index' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')

        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'lists entries marked as fragment library' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        create(:entry, type_name: 'scrolled', account:, title: 'Templates',
                       fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{title: 'Templates'}])
      end

      it 'skips entries that are not marked as fragment library' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        create(:entry, type_name: 'scrolled', account:, title: 'Some other story')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to be_empty
      end

      it 'skips libraries the user may not use files of' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        create(:entry, type_name: 'scrolled', account: create(:account),
                       title: 'Templates', fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to be_empty
      end

      it 'skips libraries of other accounts' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        create(:entry, type_name: 'scrolled', account: create(:account, with_previewer: user),
                       fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to be_empty
      end

      it 'responds with not found if fragments feature is disabled' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.status).to eq(404)
      end

      it 'includes chapters, sections and content elements of library' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        library = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        chapter = create(:scrolled_chapter,
                         revision: library.draft,
                         configuration: {'title' => 'Intro', 'kind' => 'intro'})
        section = create(:section, chapter:)
        create(:content_element, :heading, section:)

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{
                                                collections: {
                                                  chapters: [{permaId: chapter.perma_id,
                                                              configuration: {title: 'Intro',
                                                                              kind: 'intro'}}],
                                                  sections: [{permaId: section.perma_id}],
                                                  contentElements: [{typeName: 'heading'}]
                                                }
                                              }])
      end

      it 'includes files of library' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user,
                               with_feature: 'fragments')
        library = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        image_file = create(:image_file, used_in: library.draft)

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body)
          .to include_json([{collections: {imageFiles: [{id: image_file.id}]}}])
      end
    end

    def sign_in_and_lock(entry, user)
      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
