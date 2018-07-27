class AddStorylineIdToChapters < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_chapters, :storyline_id, :integer
    add_index :pageflow_chapters, [:storyline_id], name: "index_pageflow_chapters_on_storyline_id", using: :btree
  end
end
