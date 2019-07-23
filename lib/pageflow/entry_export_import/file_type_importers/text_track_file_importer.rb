module Pageflow
  module EntryExportImport
    module FileTypeImporters
      class TextTrackFileImporter
        def self.import_file(file_data)
          TextTrackFile.create!(file_data.except('id',
                                                 'updated_at',
                                                 'state',
                                                 'parent_file_id',
                                                 'parent_file_model_type'))
        end

        def self.update_association_ids(file_data, file_mappings)
          parent_file = ImportUtils.find_file_by_exported_id(
            file_mappings,
            file_data['parent_file_model_type'],
            file_data['parent_file_id']
          )

          text_track = ImportUtils.find_file_by_exported_id(
            file_mappings,
            'Pageflow::TextTrackFile',
            file_data['id'])

          text_track.update!(parent_file: parent_file)
        end
      end
    end
  end
end
