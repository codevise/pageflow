require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module PageflowScrolled
  RSpec.describe Editor::LinkableEntriesController, type: :controller do
    render_views
    include Pageflow::EditorControllerTestHelper

    routes { PageflowScrolled::Engine.routes }

    describe '#index' do
      it 'requires authentication' do
        entry = create(:entry, type_name: 'scrolled')

        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'lists ids, titles, urls and publication states of other entries of site' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        other_entry = create(:entry, type_name: 'scrolled', account:, title: 'Other story')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{
                                                id: other_entry.id,
                                                title: 'Other story',
                                                url: 'http://test.host/other-story',
                                                previewUrl: '/admin/entries/other-story/preview',
                                                publicationState: 'not_published'
                                              }])
      end

      it 'renders type names of entries' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'paged', account:)

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{typeName: 'paged'}])
      end

      it 'uses title of entry instead of revision' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        other_entry = create(:published_entry,
                             type_name: 'scrolled',
                             account:,
                             site: entry.site,
                             title: 'entry-title',
                             revision_attributes: {title: 'Revision title'})

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{
                                                id: other_entry.id,
                                                title: 'entry-title'
                                              }])
      end

      it 'renders signatures that let links to entries resolve' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        other_entry = create(:entry, type_name: 'scrolled', account:)

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')
        signature = JSON.parse(response.body).first['signature']

        expect(EntryLinkSignature.valid?(other_entry.id, signature)).to eq(true)
      end

      it 'skips current entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to be_empty
      end

      it 'skips entries of other sites' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'scrolled', account:, site: create(:site, account:))

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to be_empty
      end

      it 'skips entries the user may not preview' do
        user = create(:user)
        account = create(:account)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'scrolled', account:)

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to be_empty
      end

      it 'skips fragment libraries' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to be_empty
      end

      it 'lists entries of other entry types' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'paged', account:, title: 'Paged story')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{
                                                title: 'Paged story'
                                              }])
      end

      it 'lists entries of site for admins' do
        user = create(:user, :admin)
        account = create(:account)
        entry = create(:entry, type_name: 'scrolled', account:)
        create(:entry, type_name: 'scrolled', account:, title: 'Other story')
        create(:entry, type_name: 'scrolled', title: 'Story of other account')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(JSON.parse(response.body).map { |item| item['title'] }).to eq(['Other story'])
      end

      it 'orders entries by title' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'scrolled', account:, title: 'Zebra')
        create(:entry, type_name: 'scrolled', account:, title: 'Aardvark')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{title: 'Aardvark'}, {title: 'Zebra'}])
      end
    end

    describe '#show' do
      it 'renders draft structure of linked entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry, type_name: 'scrolled', account:)
        chapter = create(:scrolled_chapter,
                         revision: linked_entry.draft,
                         configuration: {title: 'Intro'})
        section = create(:section, chapter:)
        create(:content_element, :heading, section:)

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')

        expect(response.body).to include_json(
          collections: {
            chapters: [{permaId: chapter.perma_id, chapterSlug: 'intro'}],
            sections: [{permaId: section.perma_id}],
            contentElements: [{typeName: 'heading'}]
          }
        )
      end

      it 'renders chapters and sections of linked entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry, type_name: 'scrolled', account:)
        chapter = create(:scrolled_chapter,
                         revision: linked_entry.draft,
                         configuration: {title: 'Intro'})
        section = create(:section, chapter:)

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')

        expect(response.body).to include_json(
          id: linked_entry.id,
          typeName: 'scrolled',
          chapters: [{permaId: chapter.perma_id, title: 'Intro', slug: 'intro'}],
          sections: [{permaId: section.perma_id}]
        )
      end

      it 'renders signatures for chapters and sections' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry, type_name: 'scrolled', account:)
        chapter = create(:scrolled_chapter, revision: linked_entry.draft)
        section = create(:section, chapter:)

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')
        result = JSON.parse(response.body)

        expect(EntryLinkSignature.valid?(linked_entry.id,
                                         result['chapters'][0]['signature'],
                                         chapter: chapter.perma_id)).to eq(true)
        expect(EntryLinkSignature.valid?(linked_entry.id,
                                         result['sections'][0]['signature'],
                                         section: section.perma_id)).to eq(true)
      end

      it 'renders hidden chapters and sections' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry, type_name: 'scrolled', account:)
        chapter = create(:scrolled_chapter, revision: linked_entry.draft)
        section = create(:section, chapter:, configuration: {hidden: true})

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')

        expect(response.body).to include_json(
          chapters: [{permaId: chapter.perma_id}],
          sections: [{permaId: section.perma_id}],
          collections: {
            chapters: [{permaId: chapter.perma_id}],
            sections: [{permaId: section.perma_id}]
          }
        )
      end

      it 'does not render entries linked from linked entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry, type_name: 'scrolled', account:)
        other_entry = create(:entry, type_name: 'scrolled', account:)
        create(:content_element,
               revision: linked_entry.draft,
               configuration: {
                 value: [{
                   type: 'link',
                   href: {entry: other_entry.id,
                          signature: EntryLinkSignature.generate(other_entry.id)},
                   children: [{text: 'Link'}]
                 }]
               })

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')

        expect(JSON.parse(response.body)['collections']).not_to have_key('linkedEntries')
      end

      it 'responds with not found for entries the user may not preview' do
        user = create(:user)
        account = create(:account)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry, type_name: 'scrolled', account:)

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')

        expect(response.status).to eq(404)
      end

      it 'responds with not found for entries of other sites' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry,
                              type_name: 'scrolled',
                              account:,
                              site: create(:site, account:))

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')

        expect(response.status).to eq(404)
      end

      it 'responds with not found for entries of other entry types' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        linked_entry = create(:entry, type_name: 'paged', account:)

        sign_in_and_lock(entry, user)
        get(:show,
            params: {entry_type: 'scrolled', entry_id: entry, id: linked_entry.id},
            format: 'json')

        expect(response.status).to eq(404)
      end
    end

    def sign_in_and_lock(entry, user)
      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
