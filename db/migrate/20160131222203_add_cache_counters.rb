class AddCacheCounters < ActiveRecord::Migration[4.2]
  def self.up
    add_column :pageflow_accounts, :users_count, :integer, default: 0, null: false
    add_column :pageflow_accounts, :entries_count, :integer, default: 0, null: false

    execute(<<-SQL)
      UPDATE pageflow_accounts SET users_count = (
        SELECT COUNT(*)
        FROM users
        WHERE users.account_id = pageflow_accounts.id
      ), entries_count = (
        SELECT COUNT(*)
        FROM pageflow_entries
        WHERE pageflow_entries.account_id = pageflow_accounts.id
      );
    SQL
  end

  def self.down
    remove_column :pageflow_accounts, :users_count
    remove_column :pageflow_accounts, :entries_count
  end
end
