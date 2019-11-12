class CreatePageflowFileImports < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_file_imports do |t|
      t.references :entry
      t.integer :file_id
      t.string :file_type
      t.text :download_options

      t.timestamps
    end
  end
end
