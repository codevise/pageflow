module Pageflow
  module EntryExportImport
    module FileTypeImporters
      class AudioFileImporter
        def self.import_file(file_data, _file_mappings)
          AudioFile.create!(file_data.except('id',
                                             'updated_at',
                                             'state',
                                             'encoding_progress',
                                             'encoding_error_message'))
        end
      end
    end
  end
end
