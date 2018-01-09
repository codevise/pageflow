class RemoveEntryIdFromChapters < ActiveRecord::Migration[4.2]
  def change
    remove_column :pageflow_chapters, :entry_id
  end
end
