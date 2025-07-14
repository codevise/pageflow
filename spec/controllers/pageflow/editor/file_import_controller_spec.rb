require 'spec_helper'

module Pageflow
  describe Editor::FileImportController do
    routes { Engine.routes }
    render_views

    describe '#search' do
      it 'requires user to be signed in' do
        entry = create(:entry)
        get(:search, params: {query: 'test', entry_id: entry.id, file_import_name: 'default'})

        expect(response.status).to eq(302)
      end

      it 'does not invoke the disabled importer' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry, with_editor: user)
        sign_in(user, scope: :user)
        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        expect(file_importer).not_to receive(:search)
        expect {
          get(:search,
              params: {query: 'test', file_import_name: file_importer.name, entry_id: entry})
        }.to raise_error(RuntimeError, "Unknown file importer with name '#{file_importer.name}'.")
      end

      it 'makes the call to the specified file importer' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        expect(file_importer).to receive(:search).with(nil, 'test')
        get(:search, params: {query: 'test', file_import_name: file_importer.name, entry_id: entry})
      end

      it 'call the search method of specified file importer with credentials' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)
        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        token = create(:authentication_token, user:)

        expect(file_importer).to receive(:search).with(token.auth_token, 'test')
        get(:search, params: {query: 'test', file_import_name: file_importer.name, entry_id: entry})
      end

      it 'returns the search result as received from file importer' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        file_importer_response = file_importer.search(nil, 'test')
        get(:search, params: {query: 'test', file_import_name: file_importer.name, entry_id: entry})

        expect(response.body).to eq({data: file_importer_response}.to_json)
      end
    end

    describe '#files_meta_data' do
      it 'call files_meta_data method of the specified file importer with credentials' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        token = create(:authentication_token, user:)
        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {'0' => selected_file}

        expect(file_importer)
          .to receive(:files_meta_data).with(token.auth_token,
                                             ActionController::Parameters.new(selected_files))

        post(:files_meta_data, params: {files: selected_files,
                                        file_import_name: file_importer.name,
                                        entry_id: entry})
      end

      it 'returns the files meta data as received from specified file importer' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {'0' => selected_file}
        post(:files_meta_data, params: {files: selected_files,
                                        file_import_name: file_importer.name,
                                        entry_id: entry})

        expectation = {data: file_importer.files_meta_data(nil, selected_files)}.to_json
        expect(response.body).to eq(expectation)
      end
    end

    describe '#start_import_job', perform_jobs: true do
      include ActiveJob::TestHelper

      let(:zencoder_options) do
        Pageflow.config.zencoder_options
      end

      before do
        stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
          .to_return(status: 200, body: File.read('spec/fixtures/image.jpg'))
      end

      after do
        clear_enqueued_jobs
        clear_performed_jobs
      end

      it 'does not allow importing files for entries the signed in user is not editor of' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file_importer = TestFileImporter.new

        pageflow_configure do |config|
          config.file_importers.register(file_importer)
        end

        sign_in(user, scope: :user)

        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {'0' => selected_file}
        meta_data = file_importer.files_meta_data(nil, selected_files)

        expect(file_importer).not_to receive(:donwload_file)

        post(:start_import_job,
             params: {files: meta_data[:files],
                      collection: meta_data[:collection],
                      file_import_name: file_importer.name,
                      entry_id: entry},
             format: :json)

        expect(response.status).to eq(403)
      end

      it 'does not start the import job if importer is disabled' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry, with_editor: user)
        sign_in(user, scope: :user)
        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {'0' => selected_file}
        meta_data = file_importer.files_meta_data(nil, selected_files)
        expect(file_importer).not_to receive(:donwload_file)
        expect {
          post(:start_import_job,
               params: {files: meta_data[:files],
                        collection: meta_data[:collection],
                        file_import_name: file_importer.name,
                        entry_id: entry},
               format: :json)
        }.to raise_error(RuntimeError, "Unknown file importer with name '#{file_importer.name}'.")

        assert_performed_jobs 0
      end

      it 'makes the download_file call to the specified file importer with credentials' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        token = create(:authentication_token, user:)

        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {'0' => selected_file}
        meta_data = file_importer.files_meta_data(nil, selected_files)
        expect(file_importer).to receive(:download_file).with(token.auth_token, anything)
        post(:start_import_job,
             params: {files: meta_data[:files],
                      collection: meta_data[:collection],
                      file_import_name: file_importer.name,
                      entry_id: entry},
             format: :json)
      end

      it 'creates the entry file and usage record in the database for each selected file' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {'0' => selected_file}
        meta_data = file_importer.files_meta_data(nil, selected_files)
        post(:start_import_job,
             params: {files: meta_data[:files],
                      collection: meta_data[:collection],
                      file_import_name: file_importer.name,
                      entry_id: entry},
             format: :json)

        expect(entry.draft.image_files.count).to eq(1)
      end

      it 'starts the file import job for each selected file' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {'0' => selected_file}
        meta_data = file_importer.files_meta_data(nil, selected_files)
        post(:start_import_job,
             params: {files: meta_data[:files],
                      collection: meta_data[:collection],
                      file_import_name: file_importer.name,
                      entry_id: entry},
             format: :json)

        assert_performed_jobs selected_files.size * 2 # one job for file import and one for upload
      end

      it 'responds with list of files rendered from editor file partial' do
        user = create(:user)
        file_importer = TestFileImporter.new
        entry = create(:entry,
                       with_editor: user,
                       with_feature: :test_file_importer)
        sign_in(user, scope: :user)

        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        selected_files = file_importer.search(nil, nil)['photos']
        meta_data = file_importer.files_meta_data(nil,
                                                  '0' => selected_files[0],
                                                  '1' => selected_files[1])
        post(:start_import_job,
             params: {files: meta_data[:files],
                      collection: meta_data[:collection],
                      file_import_name: file_importer.name,
                      entry_id: entry},
             format: :json)

        expect(response.body)
          .to include_json([
                             {
                               source_url: selected_files[0]['url'],
                               attributes: {
                                 perma_id: (be > 0),
                                 retryable: false,
                                 file_name: a_kind_of(String)
                               }
                             },
                             {
                               source_url: selected_files[1]['url'],
                               attributes: {
                                 perma_id: (be > 0),
                                 retryable: false,
                                 file_name: a_kind_of(String)
                               }
                             }
                           ])
      end
    end
  end
end
