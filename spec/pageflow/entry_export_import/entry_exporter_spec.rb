require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe EntryExporter do
      let(:entry) { create(:entry, :published) }
      let(:export_directory) { Engine.root.join('spec', 'fixtures', 'exported_entry') }

      it 'calls each export stages method' do
        exporter = EntryExporter.new(export_directory)
        allow(exporter).to receive(:download_entry_files_to_directory)
        allow(exporter).to receive(:generate_export_zip_file)

        exporter.call(entry)
      end

      describe 'file download' do
        include UsedFileTestHelper

        it 'downloads the files specified by the file types #attachments_for_export method' do
          published_entry = PublishedEntry.new(entry)
          create_used_file(:image_file, entry: published_entry)

          exporter = EntryExporter.new(export_directory)
          allow(exporter).to receive(:generate_export_zip_file)

          allow_any_instance_of(ImageFile)
            .to receive(:attachments_for_export).and_return([])

          exporter.call(entry)
        end
      end
    end
  end
end
