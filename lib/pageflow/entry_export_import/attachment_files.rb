module Pageflow
  module EntryExportImport
    # Download/upload files during export/import
    module AttachmentFiles
      extend self

      def download_and_archive_originals(revision, archive)
        revision.file_usages.each do |file_usage|
          reusable_file = file_usage.file

          reusable_file.attachments_for_export.each do |attachment|
            download_and_archive_attachment_file(reusable_file, attachment, archive)
          end
        end
      end

      def extract_and_upload_originals(entry, archive_file_name, file_mappings)
        each_reusable_file(entry) do |reusable_file|
          exported_id = file_mappings.exported_id_for(reusable_file.class.name,
                                                      reusable_file.id)

          UploadAndPublishFileJob.perform_later(reusable_file,
                                                exported_id,
                                                archive_file_name)
        end
      end

      def archive_path(reusable_file, attachment, exported_id: reusable_file.id)
        File.join(reusable_file.file_type.collection_name,
                  exported_id.to_s,
                  attachment.name.to_s,
                  attachment.original_filename)
      end

      private

      def each_reusable_file(entry, &block)
        Pageflow.config.file_types.each do |file_type|
          file_type.model.where(entry: entry).each(&block)
        end
      end

      def download_and_archive_attachment_file(reusable_file, attachment, archive)
        archive_path = archive_path(reusable_file, attachment)

        return if archive.include?(archive_path)

        download_attachment_file(attachment) do |tempfile|
          archive.add(archive_path, tempfile)
        end
      end

      def download_attachment_file(attachment)
        tempfile = Paperclip.io_adapters.for(attachment)

        begin
          yield(tempfile)
        ensure
          tempfile.close
          tempfile.unlink
        end
      end
    end
  end
end
