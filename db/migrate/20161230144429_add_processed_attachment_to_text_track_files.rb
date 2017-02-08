class AddProcessedAttachmentToTextTrackFiles < ActiveRecord::Migration
  def change
    add_column :pageflow_text_track_files, :processed_attachment_file_name, :string
    add_column :pageflow_text_track_files, :processed_attachment_content_type, :string
    add_column :pageflow_text_track_files, :processed_attachment_file_size, :integer, limit: 8
    add_column :pageflow_text_track_files, :processed_attachment_updated_at, :datetime
  end
end
