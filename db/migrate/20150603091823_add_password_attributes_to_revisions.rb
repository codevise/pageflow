class AddPasswordAttributesToRevisions < ActiveRecord::Migration
  def change
    add_column :pageflow_revisions, :password_protected, :boolean
    add_column :pageflow_entries, :password_digest, :string
  end
end
