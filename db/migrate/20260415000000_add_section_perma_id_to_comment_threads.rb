class AddSectionPermaIdToCommentThreads < ActiveRecord::Migration[7.1]
  def change
    add_column :pageflow_comment_threads, :section_perma_id, :integer
  end
end
