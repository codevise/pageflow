class AddCustomFields < ActiveRecord::Migration
  def change
    add_column :pageflow_entries, :custom_field, :string
    add_column :pageflow_accounts, :custom_field, :string
    add_column :pageflow_themings, :custom_field, :string
  end
end
