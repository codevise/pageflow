class AssociateEntryTemplatesWithSites < ActiveRecord::Migration[5.2]
  def up
    add_reference(:pageflow_entry_templates, :site)
    add_index(:pageflow_entry_templates, [:site_id, :entry_type_name], unique: true)

    execute(<<-SQL)
        UPDATE pageflow_entry_templates
        LEFT JOIN pageflow_accounts
        ON pageflow_accounts.id = pageflow_entry_templates.account_id
        SET site_id = pageflow_accounts.default_site_id;
    SQL

    remove_index(:pageflow_entry_templates, name: 'unique_index_entry_templates_account_entry_type')
    remove_reference(:pageflow_entry_templates, :account)
  end

  def down
    add_reference(:pageflow_entry_templates, :account)
    add_index(:pageflow_entry_templates,
              [:account_id, :entry_type_name],
              unique: true,
              name: 'unique_index_entry_templates_account_entry_type')

    execute(<<-SQL)
        UPDATE pageflow_entry_templates
        LEFT JOIN pageflow_sites
        ON pageflow_sites.id = pageflow_entry_templates.site_id
        SET pageflow_entry_templates.account_id = pageflow_sites.account_id;
    SQL

    remove_index(:pageflow_entry_templates, [:site_id, :entry_type_name])
    remove_reference(:pageflow_entry_templates, :site)
  end
end
