class RenameThemeToTheming < ActiveRecord::Migration
  def change
    rename_table :pageflow_themes, :pageflow_themings

    remove_reference :pageflow_entries, :theme, :index => true
    add_reference :pageflow_entries, :theming, :index => true

    remove_reference :pageflow_accounts, :default_theme
    add_reference :pageflow_accounts, :default_theming
  end
end
