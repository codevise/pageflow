class AddRoleToPageflowScrolledStorylines < ActiveRecord::Migration[7.2]
  def change
    add_column :pageflow_scrolled_storylines, :role, :string
  end
end
