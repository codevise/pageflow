module Pageflow
  module EntryExportImport
    module FileTypeImporters
      class TextTrackFileImporter
        def self.import_file(file_data, file_mappings)
          update_association_ids(file_data, file_mappings)
          TextTrackFile.create!(file_data.except('id',
                                                 'updated_at',
                                                 'state'))
        end

        def self.update_association_ids(file_data, file_mappings)
          new_parent_file_id = ImportUtils.file_id_for_exported_id(
            file_mappings,
            file_data['parent_file_model_type'],
            file_data['parent_file_id']
          )

          file_data['parent_file_id'] = new_parent_file_id
        end
      end
    end
  end
end
