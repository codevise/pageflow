module Pageflow
  module EntryExportImport
    class ImportUtils
      def self.file_id_for_exported_id(file_mappings, model_name, exported_id)
        file_model = model_name.constantize
        file_type = Pageflow.config.file_types.find_by_model!(file_model)
        file_type_collection_name = file_type.collection_name
        file_mappings[file_type_collection_name][exported_id.to_i]
      end
    end
  end
end
