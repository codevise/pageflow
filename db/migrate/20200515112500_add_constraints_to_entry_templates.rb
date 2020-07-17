class AddConstraintsToEntryTemplates < ActiveRecord::Migration[5.2]
  def up
    change_column_null :pageflow_entry_templates, :account_id, false
    change_column_null :pageflow_entry_templates, :entry_type, false

    execute(<<-SQL)
      ALTER TABLE `pageflow_entry_templates`
        ADD UNIQUE `unique_index_entry_templates_account_entry_type`(`account_id`, `entry_type`);
    SQL
  end

  def down
    execute(<<-SQL)
      ALTER TABLE `pageflow_entry_templates`
        DROP INDEX `unique_index_entry_templates_account_entry_type`;
    SQL

    change_column_null :pageflow_entry_templates, :account_id, true
    change_column_null :pageflow_entry_templates, :entry_type, true
  end
end
