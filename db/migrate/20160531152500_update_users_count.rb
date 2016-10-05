class UpdateUsersCount < ActiveRecord::Migration
  def self.up
    add_column :pageflow_entries, :users_count, :integer, default: 0, null: false

    execute(<<-SQL)
      UPDATE pageflow_accounts SET users_count = (
        SELECT COUNT(*)
        FROM pageflow_memberships
        WHERE pageflow_memberships.entity_id = pageflow_accounts.id AND
        pageflow_memberships.entity_type = 'Pageflow::Account'
      );
    SQL

    execute(<<-SQL)
      UPDATE pageflow_entries SET users_count = (
        SELECT COUNT(*)
        FROM pageflow_memberships
        WHERE pageflow_memberships.entity_id = pageflow_entries.id AND
        pageflow_memberships.entity_type = 'Pageflow::Entry'
      );
    SQL
  end

  def self.down
    remove_column :pageflow_entries, :users_count
  end
end
