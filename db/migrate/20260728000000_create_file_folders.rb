class CreateFileFolders < ActiveRecord::Migration[7.1]
  def change
    create_table :pageflow_file_folders do |t|
      t.integer :revision_id, null: false
      t.integer :perma_id
      t.integer :parent_folder_perma_id
      t.string :name, null: false
      t.timestamps
    end

    add_index :pageflow_file_folders, [:revision_id, :perma_id]
    add_index :pageflow_file_folders, [:revision_id, :parent_folder_perma_id],
              name: 'index_file_folders_on_revision_and_parent_folder'

    add_column :pageflow_file_usages, :folder_perma_id, :integer
  end
end
