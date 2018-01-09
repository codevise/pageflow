class AddEmphasizeNewPagesToRevisions < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_revisions, :emphasize_new_pages, :boolean, default: false, null: false
  end
end
