module Pageflow
  # Uploads a file associated with a hosted file
  # and publishes it afterwards
  class UploadAndPublishFileJob < ApplicationJob
    queue_as :file_upload

    def perform(model, file_id, file_path)
      file = model.constantize.find(file_id)
      EntryExportImport::S3FileUploader.new.upload_file(file, file_path)
      file.publish!
    end
  end
end
