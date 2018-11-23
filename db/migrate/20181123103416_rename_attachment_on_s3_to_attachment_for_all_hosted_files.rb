class RenameAttachmentOnS3ToAttachmentForAllHostedFiles < ActiveRecord::Migration[5.2]
  def change
    %w(image video audio text_track).each do |hosted_file_type|
      rename_column "pageflow_#{hosted_file_type}_files",
                    :attachment_on_s3_file_name,
                    :attachment_file_name
      rename_column "pageflow_#{hosted_file_type}_files",
                    :attachment_on_s3_content_type,
                    :attachment_content_type
      rename_column "pageflow_#{hosted_file_type}_files",
                    :attachment_on_s3_file_size,
                    :attachment_file_size
      rename_column "pageflow_#{hosted_file_type}_files",
                    :attachment_on_s3_updated_at,
                    :attachment_updated_at
    end
  end
end
