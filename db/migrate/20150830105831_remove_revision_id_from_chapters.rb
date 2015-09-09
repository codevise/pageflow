class RemoveRevisionIdFromChapters < ActiveRecord::Migration
  def change
    remove_column :pageflow_chapters, :revision_id
  end
end
