# This migration comes from pageflow (originally 20140625184800)
class DropThemes < ActiveRecord::Migration
  def up
    rename_column :pageflow_accounts_themes, :theme_id, :theme_name
    add_column :pageflow_themings, :theme_name, :string

    execute(<<-SQL)
      UPDATE pageflow_themings SET theme_name =
        (SELECT css_dir FROM pageflow_themes WHERE pageflow_themes.id = pageflow_themings.theme_id);
    SQL

    remove_reference :pageflow_themings, :theme
    drop_table :pageflow_themes
  end
end
