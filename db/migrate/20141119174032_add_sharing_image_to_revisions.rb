class AddSharingImageToRevisions < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_revisions, :share_image_id, :integer
    add_column :pageflow_revisions, :share_image_x, :integer
    add_column :pageflow_revisions, :share_image_y, :integer
  end
end
