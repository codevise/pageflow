class AddPermaIdToFileUsages < ActiveRecord::Migration[5.2]
  def up
    add_column :pageflow_file_usages, :file_perma_id, :integer, after: 'file_id'
    add_index :pageflow_file_usages,
              [:revision_id, :file_type, :file_perma_id],
              name: 'index_pageflow_file_usages_on_revision_and_file'
    execute('UPDATE pageflow_file_usages SET file_perma_id = file_id;')
  end

  def down
    remove_column :pageflow_file_usages, :file_perma_id
  end
end
