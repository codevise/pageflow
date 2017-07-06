module Pageflow
  class UploadFileToS3Job
    @queue = :slow

    extend StateMachineJob

    def self.perform_with_result(file, options = {})
      if file.attachment_on_s3.exists?
        logger.info "#{file.class.name} #{file.id} already exists on S3."
        :ok
      elsif file.attachment_on_filesystem.exists?
        file.update! attachment_on_s3: attachment_on_filesystem
        file.attachment_on_filesystem.destroy unless file.keep_on_filesystem_after_upload_to_s3?
        :ok
      else
        logger.info "#{file.class.name} #{file.id} not yet transfered to instance."
        :pending
      end
    rescue => e
      logger.warn "#{file.class.name} #{file.id} raised #{e.message}."
      :error
    end
  end
end
