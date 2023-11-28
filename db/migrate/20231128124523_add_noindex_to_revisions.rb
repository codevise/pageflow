class AddNoindexToRevisions < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_revisions, :noindex, :boolean
  end
end
