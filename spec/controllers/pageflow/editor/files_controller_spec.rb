require 'spec_helper'

module Pageflow
  describe Editor::FilesController do
    routes { Engine.routes }
    render_views

    describe '#index' do
      it 'returns list of files of entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:image_file)
        create(:file_usage, revision: entry.draft, file: file)

        sign_in(user)
        get(:index, entry_id: entry.id, collection_name: 'image_files', format: 'json')

        expect(json_response(path: [0, 'id'])).to eq(file.id)
      end

      it 'returns list of files of account' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account: account)
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
      it 'responds with success for signed in editor of the entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {attachment: image_fixture_upload},
             format: 'json')

        expect(response.status).to eq(200)
      end

      it 'allows to set rights and configuration' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {
               attachment: image_fixture_upload,
               rights: 'someone',
               configuration: {
                 some: 'value'
               }
             },
             format: 'json')

        file = entry.image_files.last
        expect(file.rights).to eq('someone')
        expect(file.configuration['some']).to eq('value')
      end

      it 'creates file for entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)

        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {attachment: image_fixture_upload},
             format: 'json')

        expect(entry.image_files).to have(1).item
      end

      it 'includes usage_id in response' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {attachment: image_fixture_upload},
             format: 'json')

        expect(json_response(path: [:usage_id])).to be_present
      end

      it 'uploads attachment' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in user
        acquire_edit_lock(user, entry)
        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {attachment: image_fixture_upload},
             format: 'json')

        expect(entry.image_files.first.unprocessed_attachment_file_name).to be_present
      end

      it 'does not allow to create file for entry the signed in user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in user
        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {attachment: image_fixture_upload},
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to create file if not signed in' do
        entry = create(:entry)

        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {attachment: image_fixture_upload},
             format: 'json')

        expect(response.status).to eq(401)
      end

      it 'allows to create file with associated parent file' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:video_file, used_in: entry.draft)

        sign_in(user)
        acquire_edit_lock(user, entry)

        post(:create,
             entry_id: entry,
             collection_name: 'text_track_files',
             text_track_file: {attachment: text_track_fixture_upload,
                               parent_file_id: parent_file.id,
                               parent_file_model_type: 'Pageflow::VideoFile'},
             format: 'json')

        expect(parent_file.nested_files(Pageflow::TextTrackFile)).not_to be_empty
        expect(response.status).to eq(200)
      end

      it 'does not allow to create file with associated parent file of non-permitted type' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:image_file, entry: entry)

        sign_in(user)
        acquire_edit_lock(user, entry)

        post(:create,
             entry_id: entry,
             collection_name: 'image_files',
             image_file: {attachment: image_fixture_upload,
                          parent_file_id: parent_file.id,
                          parent_file_model_type: 'Pageflow::ImageFile'},
             format: 'json')

        expect(parent_file.nested_files(Pageflow::ImageFile)).to be_empty
        expect(response.status).to eq(400)
      end

      it 'does not allow to create file with associated parent file on other entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:image_file)

        sign_in(user)
        acquire_edit_lock(user, entry)

        post(:create,
             entry_id: entry,
             collection_name: 'text_track_files',
             text_track_file: {attachment: text_track_fixture_upload,
                               parent_file_id: parent_file.id,
                               parent_file_model_type: 'Pageflow::ImageFile'},
             format: 'json')

        expect(parent_file.nested_files(Pageflow::TextTrackFile)).to be_empty
        expect(response.status).to eq(400)
      end

      def image_fixture_upload
        fixture_file_upload(Engine.root.join('spec', 'fixtures', 'image.jpg'), 'image/jpeg')
      end

      def text_track_fixture_upload
        fixture_file_upload(Engine.root.join('spec', 'fixtures', 'sample.vtt'), 'text/vtt')
      end
    end

    describe '#retry' do
      it 'succeeds if encoding/processing failed' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:image_file, :failed, used_in: entry.draft)

        sign_in user
        acquire_edit_lock(user, entry)
        post(:retry, collection_name: 'image_files', id: file, format: 'json')

        expect(response.status).to eq(201)
      end

      it 'does not allow to retry encoding of file for entry the user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:image_file, :failed, used_in: entry.draft)

        sign_in user
        acquire_edit_lock(user, entry)
        post(:retry, collection_name: 'image_files', id: file, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to retry encoding of file if not signed in' do
        file = create(:image_file, :failed)

        post(:retry, collection_name: 'image_files', id: file, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'fails if image file is processed' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        image_file = create(:image_file, used_in: entry.draft)

        sign_in user
        acquire_edit_lock(user, entry)
        post(:retry, collection_name: 'image_files', id: image_file, format: 'json')

        expect(response.status).to eq(400)
      end
    end

    describe '#update' do
      it 'signed in editor of the entry can update rights and configuration' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:image_file, used_in: entry.draft, rights: 'old')

        sign_in user
        acquire_edit_lock(user, entry)
        patch(:update,
              collection_name: 'image_files',
              id: file,
              image_file: {
                rights: 'new',
                configuration: {some: 'value'}
              },
              format: 'json')

        expect(response.status).to eq(204)
        expect(file.reload.rights).to eq('new')
        expect(file.configuration['some']).to eq('value')
      end

      it 'does not allow to update file if the signed in user is not editor for its entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: entry.draft)

        sign_in user
        patch(:update,
              collection_name: 'image_files',
              id: file,
              image_file: {rights: 'new'},
              format: 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to update file if not signed in' do
        file = create(:image_file)

        patch(:update,
              collection_name: 'image_files',
              id: file,
              image_file: {rights: 'new'},
              format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'allows to destroy nested file when signed in editor of an entry that uses the parent '\
         'file' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:video_file, used_in: entry.draft)
        nested_file = create(:text_track_file, entry: entry, parent_file: parent_file)

        sign_in user

        expect(parent_file).to have(1).nested_files(TextTrackFile)

        delete(:destroy, collection_name: 'text_track_files', id: nested_file)

        expect(response.status).to eq(204)
        expect(parent_file).to have(0).nested_files(TextTrackFile)
      end

      it 'does not allow to destroy if permissions below editor of entries using the file or of '\
         'accounts containing those entries' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, with_previewer: user, account: account)
        parent_file = create(:video_file, used_in: entry.draft)
        nested_file = create(:text_track_file, entry: entry, parent_file: parent_file)

        sign_in user

        expect(parent_file).to have(1).nested_files(TextTrackFile)

        delete(:destroy, collection_name: 'text_track_files', id: nested_file)

        expect(response.status).to eq(302)
        expect(parent_file).to have(1).nested_files(TextTrackFile)
      end

      it 'does not allow to destroy file if not signed in' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:video_file, used_in: entry.draft)
        nested_file = create(:text_track_file, entry: entry, parent_file: parent_file)

        expect(parent_file).to have(1).nested_files(TextTrackFile)

        delete(:destroy, collection_name: 'text_track_files', id: nested_file)

        expect(response.status).to eq(302)
        expect(parent_file).to have(1).nested_files(TextTrackFile)
      end

      it 'does not allow to destroy non-nested file even if signed in with permissions needed for '\
         'destroying a nested file' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:video_file, used_in: entry.draft)
        create(:text_track_file, entry: entry, parent_file: parent_file)

        sign_in user

        expect(parent_file).to have(1).nested_files(TextTrackFile)
        expect(VideoFile.all.length).to eq(1)

        delete(:destroy, collection_name: 'video_files', id: parent_file)

        expect(response.status).to eq(302)
        expect(parent_file).to have(1).nested_files(TextTrackFile)
        expect(VideoFile.all.length).to eq(1)
      end
    end
  end
end
