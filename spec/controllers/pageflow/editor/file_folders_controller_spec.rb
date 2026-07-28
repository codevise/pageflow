require 'spec_helper'

module Pageflow
  describe Editor::FileFoldersController do
    routes { Engine.routes }
    render_views

    describe '#index' do
      it 'returns folders of entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        folder = create(:file_folder, revision: entry.draft, name: 'Interviews')

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.body).to include_json([{id: folder.id,
                                                perma_id: folder.perma_id,
                                                name: 'Interviews'}])
      end

      it 'does not allow to list folders of unaccessible entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires user to be signed in' do
        entry = create(:entry)

        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#create' do
      it 'creates folder in draft of entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {entry_id: entry.id, file_folder: {name: 'Interviews'}},
             format: 'json')

        expect(response.status).to eq(200)
        expect(entry.draft.file_folders.map(&:name)).to eq(['Interviews'])
      end

      it 'responds with created folder' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {entry_id: entry.id, file_folder: {name: 'Interviews'}},
             format: 'json')

        expect(response.body).to include_json(name: 'Interviews')
        expect(JSON.parse(response.body)['perma_id']).to be_present
      end

      it 'allows nesting folder inside other folder of same revision' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent = create(:file_folder, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry.id,
               file_folder: {name: 'Raw', parent_folder_perma_id: parent.perma_id}
             },
             format: 'json')

        expect(response.status).to eq(200)
        expect(entry.draft.file_folders.find_by(name: 'Raw').parent).to eq(parent)
      end

      it 'does not allow nesting folder inside folder of other revision' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_folder = create(:file_folder)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry.id,
               file_folder: {name: 'Raw', parent_folder_perma_id: other_folder.perma_id}
             },
             format: 'json')

        expect(response.status).to eq(422)
      end

      it 'does not allow to create folder without name' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {entry_id: entry.id, file_folder: {name: ''}},
             format: 'json')

        expect(response.status).to eq(422)
      end

      it 'does not allow to create folder in entry the user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        post(:create,
             params: {entry_id: entry.id, file_folder: {name: 'Interviews'}},
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires user to have edit lock on entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        post(:create,
             params: {entry_id: entry.id, file_folder: {name: 'Interviews'}},
             format: 'json')

        expect(response.status).to eq(409)
      end

      it 'requires user to be signed in' do
        entry = create(:entry)

        post(:create,
             params: {entry_id: entry.id, file_folder: {name: 'Interviews'}},
             format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#update' do
      it 'renames folder' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        folder = create(:file_folder, revision: entry.draft, name: 'Interviews')

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {entry_id: entry.id, id: folder.id, file_folder: {name: 'Portraits'}},
              format: 'json')

        expect(response.status).to eq(204)
        expect(folder.reload.name).to eq('Portraits')
      end

      it 'does not allow to rename folder to blank name' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        folder = create(:file_folder, revision: entry.draft, name: 'Interviews')

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {entry_id: entry.id, id: folder.id, file_folder: {name: ''}},
              format: 'json')

        expect(response.status).to eq(422)
        expect(folder.reload.name).to eq('Interviews')
      end

      it 'does not allow to update folder of other entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        folder = create(:file_folder, name: 'Interviews')

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {entry_id: entry.id, id: folder.id, file_folder: {name: 'Portraits'}},
              format: 'json')

        expect(response.status).to eq(404)
        expect(folder.reload.name).to eq('Interviews')
      end

      it 'does not allow to update folder of entry the user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        folder = create(:file_folder, revision: entry.draft)

        sign_in(user, scope: :user)
        patch(:update,
              params: {entry_id: entry.id, id: folder.id, file_folder: {name: 'Portraits'}},
              format: 'json')

        expect(response.status).to eq(403)
      end
    end

    describe '#destroy' do
      it 'destroys empty folder' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        folder = create(:file_folder, revision: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        delete(:destroy, params: {entry_id: entry.id, id: folder.id}, format: 'json')

        expect(response.status).to eq(204)
        expect(entry.draft.file_folders).to be_empty
      end

      it 'does not destroy folder containing files' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        folder = create(:file_folder, revision: entry.draft)
        create(:file_usage,
               revision: entry.draft,
               file: create(:image_file),
               folder_perma_id: folder.perma_id)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        delete(:destroy, params: {entry_id: entry.id, id: folder.id}, format: 'json')

        expect(response.status).to eq(422)
        expect(entry.draft.file_folders).to include(folder)
      end

      it 'does not destroy folder containing other folders' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        folder = create(:file_folder, revision: entry.draft)
        create(:file_folder, revision: entry.draft, parent_folder_perma_id: folder.perma_id)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        delete(:destroy, params: {entry_id: entry.id, id: folder.id}, format: 'json')

        expect(response.status).to eq(422)
        expect(entry.draft.file_folders).to include(folder)
      end

      it 'does not allow to destroy folder of entry the user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        folder = create(:file_folder, revision: entry.draft)

        sign_in(user, scope: :user)
        delete(:destroy, params: {entry_id: entry.id, id: folder.id}, format: 'json')

        expect(response.status).to eq(403)
      end
    end
  end
end
