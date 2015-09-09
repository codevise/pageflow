class RemoveEntryIdFromChapters < ActiveRecord::Migration
  def change
    remove_column :pageflow_chapters, :entry_id
  end
end
