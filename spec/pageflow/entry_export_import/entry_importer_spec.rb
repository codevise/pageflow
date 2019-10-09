require 'spec_helper'
require 'support/pageflow/entry_export_import/test_file_type_importer'

module Pageflow
  module EntryExportImport
    describe EntryImporter do
      let(:entry) { create(:entry, :published) }
      let(:user) { create(:user) }
      let(:attachments_root_path) do
        Engine.root.join('spec', 'fixtures', 'exported_entry', 'files')
      end

      describe 'importing entries' do
        let(:import_data) do
          EntrySerialization.dump(entry).to_json
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
      end
    end
  end
end
