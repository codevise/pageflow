require 'zip'

module Pageflow
  module EntryExportImport
    # Read and write files from and to zip archives
    class ZipArchive
      def initialize(file_name)
        Zip.force_entry_names_encoding = 'UTF-8'
        Zip.write_zip64_support = true

        @file = Zip::File.open(file_name, Zip::File::CREATE)
      end

      def include?(path)
        @file.find_entry(path).present?
      end

      def glob(pattern)
        @file.glob(pattern).map(&:name)
      end

      def add(path, stream)
        @file.get_output_stream(path) { |f| IO.copy_stream(stream, f) }
      end

      def extract_to_tempfile(path)
        Tempfile.open do |f|
          IO.copy_stream(@file.get_input_stream(path), f)
          f.rewind
          yield f
        end
      end

      def close
        @file.close
      end
    end
  end
end
