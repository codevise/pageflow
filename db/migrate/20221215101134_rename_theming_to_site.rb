class RenameThemingToSite < ActiveRecord::Migration[5.2]
  def change
    rename_table :pageflow_themings, :pageflow_sites

    rename_column :pageflow_accounts, :default_theming_id, :default_site_id
    rename_column :pageflow_entries, :theming_id, :site_id
    rename_column :pageflow_permalink_directories, :theming_id, :site_id
  end
end
