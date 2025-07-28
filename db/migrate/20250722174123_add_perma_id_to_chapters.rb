class AddPermaIdToChapters < ActiveRecord::Migration[7.1]
  def up
    add_column :pageflow_chapters, :perma_id, :integer
    execute('UPDATE pageflow_chapters SET perma_id = id;')
  end

  def down
    remove_column :pageflow_chapters, :perma_id
  end
end
