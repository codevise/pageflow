module Pageflow
  module EntryExportImport
    # Uploads a file from the specified local_path
    # to the bucket defined by the reusable file
    class S3FileUploader
      def upload_file(local_path, reusable_file)
        attachment = reusable_file.attachment
        bucket = attachment.s3_bucket
        obj = bucket.object(attachment.path)
        obj.upload_file(local_path)
      end
    end
  end
end
