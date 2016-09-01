class AddTextTrackFiles < ActiveRecord::Migration
  def change
    create_table :pageflow_text_track_files do |t|
      t.belongs_to(:entry, index: true)
      t.belongs_to(:uploader, index: true)

      t.string(:state)
      t.string(:rights)

      t.string(:attachment_on_filesystem_file_name)
      t.string(:attachment_on_filesystem_content_type)
      t.integer(:attachment_on_filesystem_file_size, limit: 8)
      t.datetime(:attachment_on_filesystem_updated_at)

      t.string(:attachment_on_s3_file_name)
      t.string(:attachment_on_s3_content_type)
      t.integer(:attachment_on_s3_file_size, limit: 8)
      t.datetime(:attachment_on_s3_updated_at)

      t.timestamps

      t.integer(:parent_file_id)
      t.string(:parent_file_model_type)

      t.text(:configuration)
    end

    add_index :pageflow_text_track_files, [:parent_file_id, :parent_file_model_type],
              name: 'index_text_track_files_on_parent_id_and_parent_model_type'
  end
end
