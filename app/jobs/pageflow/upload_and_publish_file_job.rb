module Pageflow
  # Uploads a file associated with a hosted file
  # and publishes it afterwards
  class UploadAndPublishFileJob < ApplicationJob
    queue_as :file_upload

    def perform(model, file_id, local_files_directory)
      file = model.constantize.find(file_id)
      local_file_path = File.join(local_files_directory, file.file_name)
      EntryExportImport::S3FileUploader.new.upload_file(local_file_path, file)
      file.publish!
    end
  end
end
