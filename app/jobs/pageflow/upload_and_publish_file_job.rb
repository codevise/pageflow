module Pageflow
  # Uploads a file attachment associated with an UploadableFile
  # and publishes the file afterwards
  class UploadAndPublishFileJob < ApplicationJob
    queue_as :file_upload

    def perform(model, file_id, file_path)
      uploadable_file = model.constantize.find(file_id)

      attachment = uploadable_file.attachment
      bucket = attachment.s3_bucket
      obj = bucket.object(attachment.path)
      obj.upload_file(file_path)

      uploadable_file.publish!
    end
  end
end
