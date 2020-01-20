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

        token = create(:authentication_token, user: user)

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

        token = create(:authentication_token, user: user)
        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {file1: selected_file}
        expect(file_importer).to receive(:files_meta_data).with(token.auth_token, anything)
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
        selected_files = {file1: selected_file}
        post(:files_meta_data, params: {files: selected_files,
                                        file_import_name: file_importer.name,
                                        entry_id: entry})
        expectation = {data: file_importer.files_meta_data(nil, selected_files)}.to_json
        expect(response.body).to eq(expectation)
      end
    end

    describe '#start_import_job', perform_jobs: true, stub_paperclip: true do
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

        selected_files = file_importer.search(nil, nil)['photos']
        meta_data = file_importer.files_meta_data(nil, selected_files)
        expect(file_importer).not_to receive(:donwload_file)
        expect {
          post(:start_import_job, params: {files: meta_data[:files],
                                           collection: meta_data[:collection],
                                           file_import_name: file_importer.name,
                                           entry_id: entry})
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

        token = create(:authentication_token, user: user)

        selected_file = file_importer.search(nil, nil)['photos'].first
        selected_files = {file1: selected_file}
        meta_data = file_importer.files_meta_data(nil, selected_files)
        expect(file_importer).to receive(:download_file).with(token.auth_token, anything)
        post(:start_import_job, params: {files: meta_data[:files],
                                         collection: meta_data[:collection],
                                         file_import_name: file_importer.name,
                                         entry_id: entry})
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
        selected_files = {file1: selected_file}
        meta_data = file_importer.files_meta_data(nil, selected_files)
        post(:start_import_job, params: {files: meta_data[:files],
                                         collection: meta_data[:collection],
                                         file_import_name: file_importer.name,
                                         entry_id: entry})
        files = JSON.parse(response.body)['data']
        expect(files.length).to eq(meta_data[:files].length)
        files.each_with_index do |file, index|
          expect(file['source_url']).to eq(meta_data[:files][index]['url'])
        end
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

        selected_files = file_importer.search(nil, nil)['photos']
        meta_data = file_importer.files_meta_data(nil, selected_files)
        post(:start_import_job, params: {files: meta_data[:files],
                                         collection: meta_data[:collection],
                                         file_import_name: file_importer.name,
                                         entry_id: entry})
        files = JSON.parse(response.body)['data']
        expect(files.length).to eq(meta_data[:files].length)
        assert_performed_jobs files.length * 2 # one job for file import and one for upload
      end
    end
  end
end
