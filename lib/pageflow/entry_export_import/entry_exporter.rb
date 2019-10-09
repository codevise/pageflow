module Pageflow
  module EntryExportImport
    # Exports an entry to JSON and downloads all associated files.
    class EntryExporter
      attr_reader :export_directory, :entry_files_directory, :export_file

      def initialize(export_directory)
        @export_directory = export_directory
        @entry_files_directory = File.join(@export_directory, 'files')
        FileUtils.mkdir_p(@entry_files_directory)

        @export_file = File.open(File.join(@export_directory, 'entry.json'), 'w')
      end

      def call(entry)
        export_data = Pageflow::EntryExportImport::EntrySerialization.dump(entry)

        export_file.write(export_data.to_json)
        export_file.close

        download_entry_files_to_directory(entry)
        generate_export_zip_file
      end

      private

      def download_entry_files_to_directory(entry)
        downloader = Pageflow::EntryExportImport::RevisionFileDownloader.new
        downloader.download_files(entry.draft, entry_files_directory)
        downloader.download_files(entry.published_revision, entry_files_directory)
      end

      def generate_export_zip_file
        zf = DirectoryZipFileGenerator.new(export_directory, "#{export_directory}.zip")
        zf.write
      end
    end
  end
end
