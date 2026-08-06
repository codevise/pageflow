class AddEditedAtToComments < ActiveRecord::Migration[7.1]
  def change
    add_column :pageflow_comments, :edited_at, :datetime
  end
end
