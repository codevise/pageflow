class AddShareUrlToRevisions < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_revisions, :share_url, :string, null: false, default: ''
  end
end
