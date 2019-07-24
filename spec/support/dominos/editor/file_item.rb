module Dom
  module Editor
    class FileItem < Domino
      selector '.editor .manage_files ul.files > li'

      attribute :file_name, '.file_name'

      def self.find_by_file!(file)
        find_by_file_name!(file.file_name)
      end

      def self.find_by_file_name!(file_name)
        find!(text: file_name)
      end
    end
  end
end
