class CreatePageflowFileImports < ActiveRecord::Migration[5.2]
  def up
    create_table :pageflow_file_imports do |t|
      t.references :entry
      t.integer :file_id
      t.string :file_type
      t.string :file_importer
      t.text :download_options

      t.timestamps
    end
  end

  def down
    drop_table :pageflow_file_imports
  end
end
