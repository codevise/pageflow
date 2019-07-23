require 'fileutils'

module Pageflow
  module EntryExportImport
    # Downloads all used files for a given revision
    # to the specified target directory
    class RevisionFileDownloader
      def download_files(revision, target_directory)
        return unless revision.present?
        revision.file_usages.each do |file_usage|
          reusable_file = file_usage.file
          reusable_file.attachments_for_export.each do |attachment|
            bucket = attachment.s3_bucket
            client = bucket.client
            sub_directory = File.join(target_directory,
                                      reusable_file.file_type.collection_name,
                                      reusable_file.id.to_s)
            target_file = File.join(sub_directory, reusable_file.file_name)
            next if File.exist?(target_file)

            FileUtils.mkdir_p(sub_directory)
            File.open(target_file, 'wb') do |file|
              client.get_object(bucket: bucket.name, key: attachment.path) do |chunk|
                file.write(chunk)
              end
            end
          end
        end
      end
    end
  end
end
