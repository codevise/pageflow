class CopyFileAttributesOfFailedUploads < ActiveRecord::Migration[5.2]
  def up
    %w(audio text_track video).each do |uploadable_file_type|
      execute("UPDATE pageflow_#{uploadable_file_type}_files hf
                   SET hf.attachment_on_s3_file_name = hf.attachment_on_filesystem_file_name,
                       hf.attachment_on_s3_content_type = hf.attachment_on_filesystem_content_type,
                       hf.attachment_on_s3_file_size = hf.attachment_on_filesystem_file_size,
                       hf.attachment_on_s3_updated_at = hf.attachment_on_filesystem_updated_at,
                       hf.state = 'uploading_failed'
                   WHERE hf.state = 'uploading_to_s3_failed';")
    end
  end

  def down
    %w(audio text_track video).each do |uploadable_file_type|
      execute("UPDATE pageflow_#{uploadable_file_type}_files hf
                   SET hf.attachment_on_s3_file_name = NULL,
                       hf.attachment_on_s3_content_type = NULL,
                       hf.attachment_on_s3_file_size = NULL,
                       hf.attachment_on_s3_updated_at = NULL,
                       hf.state = 'uploading_to_s3_failed'
                   WHERE hf.state = 'uploading_failed';")
    end
  end
end
