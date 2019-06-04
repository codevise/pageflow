module Pageflow
  module EntryExportImport
    # Exports an entry to JSON and downloads all associated files.
    class EntryExporter
      def initialize(export_directory)
        @export_directory = export_directory
        @entry_files_directory = File.join(@export_directory, 'files')
        FileUtils.mkdir_p(@entry_files_directory)

        @export_file = File.open(File.join(@export_directory, 'entry.json'), 'w')
      end

      def call(entry)
        serialized_entry = Pageflow::EntrySerializer.new.serialize(entry)

        @export_file.write({page_type_version_requirements: page_type_version_requirements,
                           entry: JSON.parse(serialized_entry)}.to_json)
        @export_file.close

        download_entry_files_to_directory(entry)
        generate_export_zip_file
      end

      private

      def page_type_version_requirements
        version_requirements = {}
        Pageflow.config.page_types.each do |page_type|
          version_requirements[page_type.name] = page_type.import_version_requirement
        end
        version_requirements
      end

      def download_entry_files_to_directory(entry)
        downloader = Pageflow::EntryExportImport::RevisionFileDownloader.new
        downloader.download_files(entry.draft, @entry_files_directory)
        downloader.download_files(entry.published_revision, @entry_files_directory)
      end

      def generate_export_zip_file
        zf = DirectoryZipFileGenerator.new(@export_directory, "#{@export_directory}.zip")
        zf.write
      end
    end
  end
end
