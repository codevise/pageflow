class RemoveUsersCount < ActiveRecord::Migration
  def self.up
    remove_column :pageflow_accounts, :users_count
  end

  def self.down
    add_column :pageflow_accounts, :users_count, :integer, default: 0, null: false

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
end
