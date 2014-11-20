class AddSharingImageToRevisions < ActiveRecord::Migration
  def change
    add_column :pageflow_revisions, :share_image_id, :integer
    add_column :pageflow_revisions, :share_image_x, :integer
    add_column :pageflow_revisions, :share_image_y, :integer
  end
end
