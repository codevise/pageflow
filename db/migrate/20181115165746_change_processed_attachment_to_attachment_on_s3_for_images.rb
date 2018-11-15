class ChangeProcessedAttachmentToAttachmentOnS3ForImages < ActiveRecord::Migration[5.2]
  def change
    rename_column :pageflow_image_files,
                  :processed_attachment_file_name,
                  :attachment_on_s3_file_name
    rename_column :pageflow_image_files,
                  :processed_attachment_content_type,
                  :attachment_on_s3_content_type
    rename_column :pageflow_image_files,
                  :processed_attachment_file_size,
                  :attachment_on_s3_file_size
    rename_column :pageflow_image_files,
                  :processed_attachment_updated_at,
                  :attachment_on_s3_updated_at
  end
end
