class AddEmphasizeChapterBeginningToRevisions < ActiveRecord::Migration
  def change
    add_column :pageflow_revisions, :emphasize_chapter_beginning, :boolean, default: false, null: false
  end
end
