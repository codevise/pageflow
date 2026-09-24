class AddIndexesForCommentDigestSweep < ActiveRecord::Migration[7.2]
  def change
    add_index :pageflow_comments, :created_at
    add_index :pageflow_comment_threads, :resolved_at
  end
end
