# This migration comes from pageflow (originally 20140624135421)
class CreateThemingsForExistingAccounts < ActiveRecord::Migration
  def up
    # For each account create a theming. Copy link attributes from
    # theme to theming. Store account_id on theming so we can identify
    # it as the accounts default_theming later on.
    execute(<<-SQL)
      INSERT INTO pageflow_themings
        (account_id, theme_id, imprint_link_label, imprint_link_url, copyright_link_label, copyright_link_url, created_at, updated_at)
        SELECT a.id, default_theme_id, imprint_link_label, imprint_link_url, copyright_link_label, copyright_link_url, a.created_at, a.updated_at
          FROM pageflow_accounts AS a
          LEFT JOIN pageflow_themes AS t ON t.id = a.default_theme_id;
    SQL
  end

  def down
    # Copy link attributes back to themes.
    execute(<<-SQL)
      UPDATE pageflow_themes AS t
        LEFT JOIN pageflow_themings AS g ON g.theme_id = t.id
        SET t.imprint_link_label = g.imprint_link_label,
            t.imprint_link_url = g.imprint_link_url,
            t.copyright_link_label = g.copyright_link_label,
            t.copyright_link_url = g.copyright_link_url
    SQL
  end
end
