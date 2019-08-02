require 'spec_helper'
require 'support/pageflow/entry_export_import/test_file_type_importer'

module Pageflow
  module EntryExportImport
    describe EntryImporter do
      let(:entry) { create(:entry, :published) }
      let(:user) { create(:user) }
      let!(:account) { create(:account, with_member: user) }
      let(:attachments_root_path) do
        Engine.root.join('spec', 'fixtures', 'exported_entry', 'files')
      end

      describe '#page_type_version_requirements' do
        let(:import_data) do
          {page_type_version_requirements: {test_page_type: '1.0'}}.to_json
        end

        it 'raises an error if page type version requirement is not met' do
          pageflow_configure do |config|
            config.page_types.register(TestPageType.new(name: 'test_page_type'))
          end

          importer = EntryImporter.new(user, attachments_root_path)
          expect { importer.call(import_data) }
            .to raise_error('Incompatible Plugin versions detected!')
        end
      end

      describe 'importing entries' do
        let(:import_data) do
          {
            page_type_version_requirements: {},
            entry: JSON.parse(EntrySerializer.new.serialize(entry))
          }.to_json
        end

        it 'calls each import stages method' do
          pageflow_configure do |config|
            TestFileType.register(config,
                                  model: TestUploadableFile,
                                  importer: TestFileTypeImporter)
          end

          importer = EntryImporter.new(user, attachments_root_path)
          allow(importer).to receive(:import_records)
          allow(importer).to receive(:upload_files)
          allow(importer).to receive(:publish_generated_files)

          importer.call(import_data)
        end

        it 'calls the file types registered importers stages methods' do
          pageflow_configure do |config|
            TestFileType.register(config,
                                  model: TestUploadableFile,
                                  importer: TestFileTypeImporter)
          end

          allow(TestFileTypeImporter).to receive(:import_data)
          allow(TestFileTypeImporter).to receive(:upload_files).with(
            File.join(attachments_root_path, 'pageflow_test_uploadable_files'),
            {}
          )
          allow(TestFileTypeImporter).to receive(:publish_files)

          importer = EntryImporter.new(user, attachments_root_path)
          importer.call(import_data)
        end
      end
    end
  end
end
