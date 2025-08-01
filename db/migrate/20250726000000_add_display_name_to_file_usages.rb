class AddDisplayNameToFileUsages < ActiveRecord::Migration[6.0]
  def change
    add_column :pageflow_file_usages, :display_name, :string
  end
end
