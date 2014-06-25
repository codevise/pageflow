# This migration comes from pageflow (originally 20140624135422)
class ChangeThemeReferencesToThemingReferences < ActiveRecord::Migration
  def up
    add_reference :pageflow_accounts, :default_theming, :index => true
    add_reference :pageflow_entries, :theming, :index => true

    # Use theming created for account as default_theming.
    execute(<<-SQL)
      UPDATE pageflow_accounts SET default_theming_id =
        (SELECT id FROM pageflow_themings where pageflow_accounts.id = pageflow_themings.account_id LIMIT 1);
    SQL

    # Use default theming from entry's account as theming
    execute(<<-SQL)
      UPDATE pageflow_entries SET theming_id =
        (SELECT default_theming_id FROM pageflow_accounts where pageflow_accounts.id = pageflow_entries.account_id);
    SQL

    remove_reference :pageflow_accounts, :default_theme
    remove_reference :pageflow_entries, :theme
  end

  def down
    add_reference :pageflow_accounts, :default_theme, :index => true
    add_reference :pageflow_entries, :theme, :index => true

    # Set default_theme_id to theme_id of account's default_theming.
    execute(<<-SQL)
      UPDATE pageflow_accounts SET default_theme_id =
        (SELECT id FROM pageflow_themes where pageflow_themes.id =
          (SELECT theme_id FROM pageflow_themings
             WHERE pageflow_accounts.default_theming_id = pageflow_themings.id LIMIT 1));
    SQL

    # Set theme_id to theme_id of entries's theming.
    execute(<<-SQL)
      UPDATE pageflow_entries SET theme_id =
        (SELECT id FROM pageflow_themes where pageflow_themes.id =
          (SELECT theme_id FROM pageflow_themings
             WHERE pageflow_entries.theming_id = pageflow_themings.id LIMIT 1));
    SQL

    remove_reference :pageflow_accounts, :default_theming
    remove_reference :pageflow_entries, :theming
  end
end
