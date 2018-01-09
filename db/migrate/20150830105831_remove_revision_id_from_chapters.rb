class RemoveRevisionIdFromChapters < ActiveRecord::Migration[4.2]
  def change
    remove_column :pageflow_chapters, :revision_id
  end
end
