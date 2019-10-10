module Pageflow
  module EntryExportImport
    class FileMappings
      def initialize
        @file_mappings = {}
      end

      def find_or_store(exported_file_id, file_type)
        imported_file_id = @file_mappings.dig(file_type.model.name, exported_file_id)

        if imported_file_id.present?
          imported_file_id
        else
          file = yield

          @file_mappings[file_type.model.name] ||= {}
          @file_mappings[file_type.model.name][exported_file_id] = file.id

          file.id
        end
      end

      def imported_id_for(model_name, exported_id)
        @file_mappings.fetch(model_name)[exported_id]
      end

      def exported_id_for(model_name, imported_id)
        @file_mappings.fetch(model_name).invert[imported_id]
      end
    end
  end
end
