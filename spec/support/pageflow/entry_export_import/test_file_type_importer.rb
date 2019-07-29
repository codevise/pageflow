module Pageflow
  module EntryExportImport
    class TestFileTypeImporter
      def self.import_file(file_data, file_mappings)
        update_association_ids(file_data, file_mappings)
      end

      def self.update_association_ids(_file_data, _file_mappings) end

      def self.upload_files(_collection_directory, _file_mappings) end

      def self.publish_files(_entry) end
    end
  end
end
