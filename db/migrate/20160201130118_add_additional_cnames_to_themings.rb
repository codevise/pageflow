class AddAdditionalCnamesToThemings < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_themings, :additional_cnames, :string
  end
end
