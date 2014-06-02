# This migration comes from pageflow (originally 20140526125713)
class RemoveNameFromTheming < ActiveRecord::Migration
  def change
    remove_column :pageflow_themings, :name, :string
  end
end