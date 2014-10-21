module Pageflow
  class UploadFileToS3Job
    @queue = :slow

    extend StateMachineJob

    def self.perform_with_result(file, options = {})
      if file && file.attachment_on_filesystem.file?
        if File.exists?(file.attachment_on_filesystem.path)
          file.attachment_on_s3 = file.attachment_on_filesystem
          file.save!

          file.attachment_on_filesystem.destroy unless file.keep_on_filesystem_after_upload_to_s3?
          :ok
        else
          logger.info "#{file.class.name} #{file.id} not yet transfered to instance."
          :pending
        end
      else
        logger.warn "#{file.class.name} #{file.id} does not have an attachment on the file system. ignoring."
        :error
      end
    end
  end
end
