class CreateTestMultiAttachmentFile < ActiveRecord::Migration[4.2]
  def change
    create_table :test_multi_attachment_files do |t|
      t.belongs_to(:entry, index: true)
      t.belongs_to(:uploader, index: true)

      t.integer(:parent_file_id)
      t.string(:parent_file_model_type)

      t.string(:state)
      t.string(:rights)

      t.string(:first_attachment_file_name)
      t.string(:first_attachment_content_type)
      t.integer(:first_attachment_file_size, limit: 8)
      t.datetime(:first_attachment_updated_at)

      t.string(:second_attachment_file_name)
      t.string(:second_attachment_content_type)
      t.integer(:second_attachment_file_size, limit: 8)
      t.datetime(:second_attachment_updated_at)

      t.timestamps
    end
  end
end
