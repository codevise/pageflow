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
        create(:file_usage, revision: entry.draft, file:)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id, collection_name: 'image_files'}, format: 'json')

        expect(json_response(path: [0, 'id'])).to eq(file.id)
      end

      it 'returns list of files of account' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        file = create(:image_file)
        create(:file_usage, revision: entry.draft, file:)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id, collection_name: 'image_files'}, format: 'json')

        expect(json_response(path: [0, 'id'])).to eq(file.id)
      end

      it 'does not allow to list files of unaccessible entry' do
        user = create(:user)
        entry = create(:entry)
        file = create(:image_file)
        create(:file_usage, revision: entry.draft, file:)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id, collection_name: 'image_files'}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'omits direct upload config for uploaded files' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        file = create(:image_file)
        create(:file_usage, revision: entry.draft, file:)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id, collection_name: 'image_files'}, format: 'json')

        expect(json_response(path: [0]).key?('direct_upload_config')).to be_falsey
      end

      it 'requires user to be signed in' do
        entry = create(:entry)
        get(:index, params: {entry_id: entry.id, collection_name: 'image_files'}, format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#create' do
      it 'responds with success for signed in editor of the entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(response.status).to eq(200)
      end

      it 'allows to set rights and configuration' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {
                 file_name: 'image.jpg',
                 rights: 'someone',
                 configuration: {
                   some: 'value'
                 }
               }
             },
             format: 'json')

        file = entry.draft.find_files(Pageflow::ImageFile).last
        expect(file.rights).to eq('someone')
        expect(file.configuration['some']).to eq('value')
      end

      it 'allows to set custom attribute defined via array in file type' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: Pageflow::TestUploadableFile,
                                custom_attributes: [:custom])
        end

        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'pageflow_test_uploadable_files',
               test_uploadable_file: {
                 file_name: 'image.jpg',
                 custom: 'some value'
               }
             },
             format: 'json')

        file = entry.draft.find_files(Pageflow::TestUploadableFile).last
        expect(file.custom).to eq('some value')
      end

      it 'allows to set custom attribute with permitted_create_param option in file type ' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: Pageflow::TestUploadableFile,
                                custom_attributes: {
                                  custom: {
                                    permitted_create_param: true
                                  }
                                })
        end

        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'pageflow_test_uploadable_files',
               test_uploadable_file: {
                 file_name: 'image.jpg',
                 custom: 'some value'
               }
             },
             format: 'json')

        file = entry.draft.find_files(Pageflow::TestUploadableFile).last
        expect(file.custom).to eq('some value')
      end

      it 'does not allow to set custom attribute without permitted_create_param ' \
         'option in file type' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: Pageflow::TestUploadableFile,
                                custom_attributes: {
                                  custom: {}
                                })
        end

        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'pageflow_test_uploadable_files',
               test_uploadable_file: {
                 file_name: 'image.jpg',
                 custom: 'some value'
               }
             },
             format: 'json')

        file = entry.draft.find_files(Pageflow::TestUploadableFile).last
        expect(file.custom).to be_blank
      end

      it 'does not allow to set attribute not defined as custom attributes in file type' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: Pageflow::TestUploadableFile)
        end

        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'pageflow_test_uploadable_files',
               test_uploadable_file: {
                 file_name: 'image.jpg',
                 custom: 'some value'
               }
             },
             format: 'json')

        file = entry.draft.find_files(Pageflow::TestUploadableFile).last
        expect(file.custom).to be_blank
      end

      it 'does not allow to set foreign key custom attribute for file not used in revsion' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: Pageflow::TestUploadableFile,
                                custom_attributes: {
                                  related_image_file_id: {
                                    permitted_create_param: true,
                                    model: 'Pageflow::ImageFile'
                                  }
                                })
        end

        user = create(:user)
        entry = create(:entry, with_editor: user)
        image_file = create(:image_file)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'pageflow_test_uploadable_files',
               test_uploadable_file: {
                 file_name: 'image.jpg',
                 related_image_file_id: image_file.id
               }
             },
             format: 'json')

        expect(response.status).to eq(422)
      end

      it 'allow to set foreign key custom attribute for file used in revsion' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: Pageflow::TestUploadableFile,
                                custom_attributes: {
                                  related_image_file_id: {
                                    permitted_create_param: true,
                                    model: 'Pageflow::ImageFile'
                                  }
                                })
        end

        user = create(:user)
        entry = create(:entry, with_editor: user)
        image_file = create(:image_file, used_in: entry.draft)

        sign_in(user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'pageflow_test_uploadable_files',
               test_uploadable_file: {
                 file_name: 'image.jpg',
                 related_image_file_id: image_file.id
               }
             },
             format: 'json')

        expect(response.status).to eq(200)
      end

      it 'creates file for entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(entry.image_files).to have(1).item
      end

      it 'includes usage_id in response' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(json_response(path: [:usage_id])).to be_present
      end

      it 'supplies direct upload config for client upload in response' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(json_response(path: :direct_upload_config)).to be_present
      end

      it 'does not allow to create file with path for attachment' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: '../../image.jpg'}
             },
             format: 'json')

        expect(response.status).to eq(422)
      end

      it 'does not allow to create file without required attachment file name' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: nil}
             },
             format: 'json')

        expect(response.status).to eq(422)
      end

      it 'does not allow to create file for entry the signed in user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to create file if not signed in' do
        entry = create(:entry)

        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(response.status).to eq(401)
      end

      it 'allows to create file with associated parent file' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:video_file, used_in: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'text_track_files',
               text_track_file: {file_name: 'sample.vtt',
                                 parent_file_id: parent_file.id,
                                 parent_file_model_type: 'Pageflow::VideoFile'}
             },
             format: 'json')

        expect(parent_file.nested_files(Pageflow::TextTrackFile)).not_to be_empty
        expect(response.status).to eq(200)
      end

      it 'does not allow to create file with associated parent file of non-permitted type' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:image_file, entry:)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg',
                            parent_file_id: parent_file.id,
                            parent_file_model_type: 'Pageflow::ImageFile'}
             },
             format: 'json')

        expect(parent_file.nested_files(Pageflow::ImageFile)).to be_empty
        expect(response.status).to eq(422)
      end

      it 'does not allow to create file with associated parent file on other entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        parent_file = create(:image_file)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'text_track_files',
               text_track_file: {file_name: 'sample.vtt',
                                 parent_file_id: parent_file.id,
                                 parent_file_model_type: 'Pageflow::ImageFile'}
             },
             format: 'json')

        expect(parent_file.nested_files(Pageflow::TextTrackFile)).to be_empty
        expect(response.status).to eq(422)
      end

      it 'does not publish newly created file' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(entry.image_files.first).to be_uploading
      end

      it 'publishes file directly when no_upload param is present' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:create,
             params: {
               no_upload: true,
               entry_id: entry,
               collection_name: 'image_files',
               image_file: {file_name: 'image.jpg'}
             },
             format: 'json')

        expect(entry.image_files.first).to be_processing
      end
    end

    describe '#reuse' do
      it 'creates file usage for draft of given entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        other_entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:reuse,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               file_reuse: {
                 other_entry_id: other_entry.id,
                 file_id: file.id
               }
             },
             format: 'json')

        expect(entry.draft.image_files).to include(file)
      end

      it 'cannot add file of unaccessible entry' do
        user = create(:user)
        entry = create(:entry, with_manager: user)
        other_entry = create(:entry)
        file = create(:image_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:reuse,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               file_reuse: {
                 other_entry_id: other_entry.id,
                 file_id: file.id
               }
             },
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'cannot add file to unaccessible entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        other_entry = create(:entry, with_manager: user)
        file = create(:image_file, used_in: other_entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        post(:reuse,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               file_reuse: {
                 other_entry_id: other_entry.id,
                 file_id: file.id
               }
             },
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires user to be signed in' do
        user = create(:user, :admin)
        entry = create(:entry, with_manager: user)
        other_entry = create(:entry, with_manager: user)
        file = create(:image_file, used_in: other_entry.draft)

        post(:reuse,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               file_reuse: {
                 other_entry_id: other_entry.id,
                 file_id: file.id
               }
             },
             format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#retry' do
      it 'succeeds if encoding/processing failed' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:image_file, :processing_failed, used_in: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:retry,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               id: file
             },
             format: 'json')

        expect(response.status).to eq(201)
      end

      it 'does not allow to retry encoding of file for entry the user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:image_file, :processing_failed, used_in: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:retry,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               id: file
             },
             format: 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to retry encoding of file if not signed in' do
        entry = create(:entry)
        file = create(:image_file, :processing_failed, used_in: entry.draft)

        post(:retry,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               id: file
             },
             format: 'json')

        expect(response.status).to eq(401)
      end

      it 'fails if image file is processed' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        image_file = create(:image_file, used_in: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        post(:retry,
             params: {
               entry_id: entry.id,
               collection_name: 'image_files',
               id: image_file
             },
             format: 'json')

        expect(response.status).to eq(400)
      end
    end

    describe '#update' do
      it 'signed in editor of the entry can update rights and configuration' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:image_file, used_in: entry.draft, rights: 'old')

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {
                entry_id: entry.id,
                collection_name: 'image_files',
                id: file,
                image_file: {
                  rights: 'new',
                  configuration: {some: 'value'}
                }
              },
              format: 'json')

        used_file = entry.draft.find_file(file.class, file.id)

        expect(response.status).to eq(204)
        expect(used_file.rights).to eq('new')
        expect(used_file.configuration['some']).to eq('value')
      end

      it 'does not allow updating custom attribute defined by file type' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                model: Pageflow::TestUploadableFile,
                                custom_attributes: [:custom])
        end

        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:uploadable_file, used_in: entry.draft, custom: 'some value')

        sign_in(user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {
                entry_id: entry,
                collection_name: 'pageflow_test_uploadable_files',
                id: file,
                test_uploadable_file: {
                  custom: 'updated'
                }
              },
              format: 'json')

        expect(file.reload.custom).to eq('some value')
      end

      it 'does not allow to update file if the signed in user is not editor for its entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: entry.draft)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                entry_id: entry.id,
                collection_name: 'image_files',
                id: file,
                image_file: {rights: 'new'}
              },
              format: 'json')

        expect(response.status).to eq(403)
      end

      it 'does not allow to update file if not signed in' do
        entry = create(:entry)
        file = create(:image_file, used_in: entry.draft)

        patch(:update,
              params: {
                entry_id: entry.id,
                collection_name: 'image_files',
                id: file,
                image_file: {rights: 'new'}
              },
              format: 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'allows destroying a file usage for the draft of a given entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:image_file, used_in: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        expect(entry.draft).to have(1).image_files

        delete(:destroy,
               params: {
                 entry_id: entry.id,
                 collection_name: 'image_files',
                 id: file.id
               },
               format: 'json')

        expect(entry.draft).to have(0).image_files
      end

      it 'cannot remove file from unaccessible entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:image_file, used_in: entry.draft)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)

        delete(:destroy,
               params: {
                 entry_id: entry.id,
                 collection_name: 'image_files',
                 id: file.id
               },
               format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires user to be signed in' do
        user = create(:user, :admin)
        entry = create(:entry, with_manager: user)
        file = create(:image_file, used_in: entry.draft)

        delete(:destroy,
               params: {
                 entry_id: entry.id,
                 collection_name: 'image_files',
                 id: file.id
               },
               format: 'json')

        expect(response.status).to eq(401)
      end

      it 'requires user to have edit lock on entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:image_file, used_in: entry.draft)

        sign_in(user, scope: :user)

        delete(:destroy,
               params: {
                 entry_id: entry.id,
                 collection_name: 'image_files',
                 id: file.id
               },
               format: 'json')

        expect(response.status).to eq(409)
      end
    end
  end
end
