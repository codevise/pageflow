require 'spec_helper'

module Pageflow
  describe Editor::FilesController do
    routes { Engine.routes }
    render_views

    describe '#index'do
      it 'returns list of files of entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:image_file)
        create(:file_usage, revision: entry.draft, file: file)

        sign_in(user)
        get(:index, entry_id: entry.id, collection_name: 'image_files', format: 'json')

        expect(json_response(path: [0, 'id'])).to eq(file.id)
      end

      it 'does not allow to list files of unaccessible entry' do
        user = create(:user)
        entry = create(:entry)
        file = create(:image_file)
        create(:file_usage, revision: entry.draft, file: file)

        sign_in(user)
        get(:index, entry_id: entry.id, collection_name: 'image_files', format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires user to be signed in' do
        entry = create(:entry)
        get(:index, entry_id: entry.id, collection_name: 'image_files', format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#create' do
      it 'responds with success for signed in member of the entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create, entry_id: entry, collection_name: 'image_files', image_file: {attachment: fixture_upload}, format: 'json')

        expect(response.status).to eq(200)
      end

      it 'creates file for entry' do
        user = create(:user)
        entry = create(:entry, with_member: user)

        sign_in(user)
        acquire_edit_lock(user, entry)

        post(:create, entry_id: entry, collection_name: 'image_files', image_file: {attachment: fixture_upload}, format: 'json')

        expect(entry.image_files).to have(1).item
      end

      it 'includes usage_id in response' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create, entry_id: entry, collection_name: 'image_files', image_file: {attachment: fixture_upload}, format: 'json')

        expect(json_response(path: [:usage_id])).to be_present
      end

      it 'uploads attachment' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in user
        acquire_edit_lock(user, entry)
        post(:create, entry_id: entry, collection_name: 'image_files', image_file: {attachment: fixture_upload}, format: 'json')

        expect(entry.image_files.first.unprocessed_attachment_file_name).to be_present
      end

      it 'does not allow to create file for entry the signed in user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in user
        post(:create, entry_id: entry, collection_name: 'image_files', image_file: {attachment: fixture_upload}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to create file if not signed in' do
        entry = create(:entry)

        post(:create, entry_id: entry, collection_name: 'image_files', image_file: {attachment: fixture_upload}, format: 'json')

        expect(response.status).to eq(401)
      end

      def fixture_upload
        fixture_file_upload(Engine.root.join('spec', 'fixtures', 'image.jpg'), 'image/jpeg')
      end
    end

    describe '#retry' do
      it 'succeeds if encoding/processing failed' do
        user = create(:user)
        entry = create(:entry, :with_member => user)
        file = create(:image_file, :failed, :used_in => entry.draft)

        sign_in user
        post(:retry, :collection_name => 'image_files', :id => file, :format => 'json')

        expect(response.status).to eq(201)
      end

      it 'does not allow to retry encoding of file for entry the signed in user is not member of' do
        user = create(:user)
        file = create(:image_file, :failed)

        sign_in user
        post(:retry, :collection_name => 'image_files', :id => file, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to retry encoding of file if not signed in' do
        file = create(:image_file, :failed)

        post(:retry, :collection_name => 'image_files', :id => file, :format => 'json')

        expect(response.status).to eq(401)
      end

      it 'fails if image file is processed' do
        user = create(:user)
        entry = create(:entry, :with_member => user)
        image_file = create(:image_file, :used_in => entry.draft)

        sign_in user
        post(:retry, :collection_name => 'image_files', :id => image_file, :format => 'json')

        expect(response.status).to eq(400)
      end
    end

    describe '#update' do
      it 'signed in member of the entry can update rights' do
        user = create(:user)
        entry = create(:entry, :with_member => user)
        file = create(:image_file, :used_in => entry.draft, :rights => 'old')

        sign_in user
        patch(:update, :collection_name => 'image_files', :id => file, :image_file => {:rights => 'new'}, :format => 'json')

        expect(response.status).to eq(204)
        expect(file.reload.rights).to eq('new')
      end

      it 'does not allow to update file if the signed in user is not member of' do
        user = create(:user)
        file = create(:image_file)

        sign_in user
        patch(:update, :collection_name => 'image_files', :id => file, :image_file => {:rights => 'new'}, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to updat file if not signed in' do
        file = create(:image_file)

        patch(:update, :collection_name => 'image_files', :id => file, :image_file => {:rights => 'new'}, :format => 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
