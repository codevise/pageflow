class CopyFilenamesOfProcessingFailedImages < ActiveRecord::Migration[5.2]
  def up
    execute(<<-SQL)
      UPDATE pageflow_image_files
         SET attachment_on_s3_file_name = unprocessed_attachment_file_name,
             attachment_on_s3_content_type = unprocessed_attachment_content_type,
             attachment_on_s3_file_size = unprocessed_attachment_file_size,
             attachment_on_s3_updated_at = unprocessed_attachment_updated_at
       WHERE state = 'processing_failed';
    SQL
  end

  def down
    execute(<<-SQL)
      UPDATE pageflow_image_files
         SET attachment_on_s3_file_name = NULL,
             attachment_on_s3_content_type = NULL,
             attachment_on_s3_file_size = NULL,
             attachment_on_s3_updated_at = NULL
       WHERE state = 'processing_failed';
    SQL
  end
end
