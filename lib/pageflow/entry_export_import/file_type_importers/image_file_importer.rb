module Pageflow
  module EntryExportImport
    module FileTypeImporters
      class ImageFileImporter
        def self.import_file(file_data, _file_mappings)
          ImageFile.create!(file_data.except('id',
                                             'updated_at',
                                             'state'))
        end
      end
    end
  end
end
