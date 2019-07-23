module Pageflow
  module EntryExportImport
    class ImportUtils
      def self.find_file_by_exported_id(file_mappings, model_name, exported_id)
        file_model = model_name.constantize
        file_type = Pageflow.config.file_types.find_by_model!(file_model)
        file_type_collection_name = file_type.collection_name
        new_id = file_mappings[file_type_collection_name][exported_id.to_i]
        file_model.find(new_id)
      end
    end
  end
end
