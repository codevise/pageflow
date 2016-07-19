class AddShareUrlToRevisions < ActiveRecord::Migration
  def change
    add_column :pageflow_revisions, :share_url, :string, null: false, default: ''
  end
end
