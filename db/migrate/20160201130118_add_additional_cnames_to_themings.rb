class AddAdditionalCnamesToThemings < ActiveRecord::Migration
  def change
    add_column :pageflow_themings, :additional_cnames, :string
  end
end
