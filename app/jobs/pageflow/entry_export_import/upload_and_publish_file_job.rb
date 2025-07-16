module Pageflow
  module EntryExportImport
    # Uploads a file attachment associated with an ReusableFile
    # and publishes the file afterwards
    class UploadAndPublishFileJob < ApplicationJob
      queue_as :file_upload

      def perform(reusable_file, exported_id, archive_file_name)
        archive = ZipArchive.new(archive_file_name)

        reusable_file.attachments_for_export.each do |attachment|
          archive_path = AttachmentFiles.archive_path(reusable_file,
                                                      attachment,
                                                      exported_id:)

          archive.extract_to_tempfile(archive_path) do |tempfile|
            # Paperclip skips post processing anyway since the name of
            # the tempfile does not pass the validation defined in
            # UploadableFile. To be explicit, we disable post
            # processing manually as well.
            attachment.post_processing = false
            attachment.assign(tempfile)

            # Calling `attachment.assign` changes the
            # `<attachment-name>_file_name` attribute based on the
            # name of the tempfile. To prevent `flush_writes` from
            # using these new values when constructing the
            # destionation path, we need to undo the attribute
            # changes. Restoring the attributes does not reset the
            # list of files queued for write  in the attachment.
            reusable_file.restore_attributes

            attachment.flush_writes
          end
        end

        reusable_file.publish!
      end
    end
  end
end
