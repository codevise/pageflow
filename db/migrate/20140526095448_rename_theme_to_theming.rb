class RenameThemeToTheming < ActiveRecord::Migration
  def up
    rename_table :pageflow_themes, :pageflow_themings

    add_reference :pageflow_entries, :theming, :index => true
    add_reference :pageflow_accounts, :default_theming

    execute("UPDATE pageflow_entries SET theming_id = theme_id;")
    execute("UPDATE pageflow_accounts SET default_theming_id = default_theme_id;")

    remove_reference :pageflow_entries, :theme, :index => true
    remove_reference :pageflow_accounts, :default_theme
  end

  def down
    rename_table :pageflow_themings, :pageflow_themes

    add_reference :pageflow_entries, :theme, :index => true
    add_reference :pageflow_accounts, :default_theme

    execute("UPDATE pageflow_entries SET theme_id = theming_id;")
    execute("UPDATE pageflow_accounts SET default_theme_id = default_theming_id;")

    remove_reference :pageflow_entries, :theming, :index => true
    remove_reference :pageflow_accounts, :default_theming
  end
end
