class CreateTestUploadableFile < ActiveRecord::Migration[4.2]
  def change
    create_table :test_uploadable_files do |t|
      t.belongs_to(:entry, index: true)
      t.belongs_to(:uploader, index: true)

      t.integer(:parent_file_id)
      t.string(:parent_file_model_type)

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

      t.string :custom
      t.belongs_to(:related_image_file)
    end
  end
end
