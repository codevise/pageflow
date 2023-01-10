class AssociateThemeCustomizationsWithSites < ActiveRecord::Migration[5.2]
  def up
    add_reference(:pageflow_theme_customizations, :site)

    execute(<<-SQL)
      UPDATE pageflow_theme_customizations
      LEFT JOIN pageflow_accounts
      ON pageflow_accounts.id = pageflow_theme_customizations.account_id
      SET site_id = pageflow_accounts.default_site_id;
    SQL

    remove_reference(:pageflow_theme_customizations, :account)
  end

  def down
    add_reference(:pageflow_theme_customizations, :account)

    execute(<<-SQL)
      UPDATE pageflow_theme_customizations
      LEFT JOIN pageflow_sites
      ON pageflow_sites.id = pageflow_theme_customizations.site_id
      SET pageflow_theme_customizations.account_id = pageflow_sites.account_id;
    SQL

    remove_reference(:pageflow_theme_customizations, :site)
  end
end
