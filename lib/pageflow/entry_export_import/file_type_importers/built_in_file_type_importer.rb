module Pageflow
  module EntryExportImport
    module FileTypeImporters
      # creates a file from json data without any special handling
      class BuiltInFileTypeImporter
        def initialize(local_files_directory)
          @local_files_directory = local_files_directory
        end

        def call(file_type, file_data)
          file = file_type.model.create!(file_data.except('updated_at',
                                                          'state',
                                                          'parent_file_id',
                                                          'parent_file_model_type'))
          Pageflow::UploadAndPublishFileJob.perform_later(file.class.to_s,
                                                          file.id,
                                                          @local_files_directory)
          file
        end
      end
    end
  end
end
