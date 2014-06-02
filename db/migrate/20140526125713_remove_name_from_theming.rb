class RemoveNameFromTheming < ActiveRecord::Migration
  def change
    remove_column :pageflow_themings, :name, :string
  end
end