class AddLayoutVersionToRevisions < ActiveRecord::Migration[6.0]
  def change
    add_column :pageflow_revisions, :layout_version, :integer
    change_column_default :pageflow_revisions, :layout_version, from: nil, to: 1
  end
end
