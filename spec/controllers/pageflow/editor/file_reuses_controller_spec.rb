require 'spec_helper'

module Pageflow
  describe Editor::FileReusesController do
    routes { Engine.routes }

    describe '#create' do
      it 'creates file usages for files of other entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_previewer: user)
        image_file = create(:image_file, used_in: other_entry.draft)
        video_file = create(:video_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {
                 other_entry_id: other_entry.id,
                 files: [
                   {collection_name: 'image_files', id: image_file.id},
                   {collection_name: 'video_files', id: video_file.id}
                 ]
               }
             },
             format: 'json')

        expect(entry.draft.image_files).to include(image_file)
        expect(entry.draft.video_files).to include(video_file)
      end

      it 'puts reused files into requested folder' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: other_entry.draft)
        folder = create(:file_folder, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {
                 other_entry_id: other_entry.id,
                 folder_perma_id: folder.perma_id,
                 files: [{collection_name: 'image_files', id: file.id}]
               }
             },
             format: 'json')

        expect(entry.draft.find_file(file.class, file.id).folder_perma_id)
          .to eq(folder.perma_id)
      end

      it 'redirects to entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {
                 other_entry_id: other_entry.id,
                 files: [{collection_name: 'image_files', id: file.id}]
               }
             },
             format: 'json')

        expect(response).to redirect_to(editor_entry_url(entry))
      end

      it 'does not reuse any file if one file cannot be found' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: other_entry.draft)
        file_of_third_entry = create(:image_file, used_in: create(:entry).draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {
                 other_entry_id: other_entry.id,
                 files: [
                   {collection_name: 'image_files', id: file.id},
                   {collection_name: 'image_files', id: file_of_third_entry.id}
                 ]
               }
             },
             format: 'json')

        expect(response.status).to eq(404)
        expect(entry.draft.image_files).to be_empty
      end

      it 'cannot add files of unaccessible entry' do
        user = create(:user)
        entry = create(:entry, with_manager: user)
        other_entry = create(:entry)
        file = create(:image_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {
                 other_entry_id: other_entry.id,
                 files: [{collection_name: 'image_files', id: file.id}]
               }
             },
             format: 'json')

        expect(response.status).to eq(403)
        expect(entry.draft.image_files).to be_empty
      end

      it 'cannot add files to unaccessible entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        other_entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {
                 other_entry_id: other_entry.id,
                 files: [{collection_name: 'image_files', id: file.id}]
               }
             },
             format: 'json')

        expect(response.status).to eq(403)
        expect(entry.draft.image_files).to be_empty
      end

      it 'requires edit lock' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {
                 other_entry_id: other_entry.id,
                 files: [{collection_name: 'image_files', id: file.id}]
               }
             },
             format: 'json')

        expect(response.status).to eq(409)
        expect(entry.draft.image_files).to be_empty
      end

      it 'requires user to be signed in' do
        entry = create(:entry)

        post(:create,
             params: {
               entry_id: entry.id,
               file_reuse: {other_entry_id: 1, files: []}
             },
             format: 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
