class AddNameToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_sites, :name, :string
  end
end
