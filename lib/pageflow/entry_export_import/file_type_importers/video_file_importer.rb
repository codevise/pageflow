module Pageflow
  module EntryExportImport
    module FileTypeImporters
      class VideoFileImporter
        def self.import_file(file_data)
          VideoFile.create!(file_data.except('id',
                                             'updated_at',
                                             'state',
                                             'encoding_progress',
                                             'encoding_error_message'))
        end
      end
    end
  end
end
