class AddSubjectRangeToCommentThreads < ActiveRecord::Migration[7.1]
  def change
    add_column :pageflow_comment_threads, :subject_range, :text
  end
end
