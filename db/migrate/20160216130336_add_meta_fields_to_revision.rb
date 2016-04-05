class AddMetaFieldsToRevision < ActiveRecord::Migration
  def change
    add_column :pageflow_revisions, :author, :string
    add_column :pageflow_revisions, :publisher, :string
    add_column :pageflow_revisions, :keywords, :string
  end
end
