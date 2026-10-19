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

      it 'lists ids, titles and urls of other entries of account' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        other_entry = create(:entry, type_name: 'scrolled', account:, title: 'Other story')

        sign_in_and_lock(entry, user)
        get(:index, params: {entry_type: 'scrolled', entry_id: entry}, format: 'json')

        expect(response.body).to include_json([{
                                                id: other_entry.id,
                                                permaId: other_entry.id,
                                                title: 'Other story',
                                                url: 'http://test.host/other-story',
                                                previewUrl: '/admin/entries/other-story/preview',
                                                publicationState: 'not_published'
                                              }])
      end

      it 'uses title of entry instead of revision' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        other_entry = create(:published_entry,
                             type_name: 'scrolled',
                             account:,
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

      it 'skips entries of other accounts' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, with_editor: user)
        create(:entry, type_name: 'scrolled', account: create(:account, with_previewer: user))

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
                                                title: 'Paged story',
                                                url: 'http://test.host/paged-story'
                                              }])
      end

      it 'lists entries of account for admins' do
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

    def sign_in_and_lock(entry, user)
      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
