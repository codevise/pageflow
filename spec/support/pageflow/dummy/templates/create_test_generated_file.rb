class CreateTestGeneratedFile < ActiveRecord::Migration[4.2]
  def change
    create_table :test_generated_files do |t|
      t.belongs_to(:entry, index: true)
      t.belongs_to(:uploader, index: true)

      t.integer(:parent_file_id)
      t.string(:parent_file_model_type)

      t.string(:state)
      t.string(:rights)

      t.string(:url)

      t.timestamps
    end
  end
end
