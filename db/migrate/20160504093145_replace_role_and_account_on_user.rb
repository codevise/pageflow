class ReplaceRoleAndAccountOnUser < ActiveRecord::Migration
  def change
    reversible do |dir|
      dir.up do
        add_account_member_membership_for_each_user
        update_membership_role_to_manager_for_each_account_manager
      end
    end

    add_column :users, :admin, :boolean, null: false, default: false

    reversible do |dir|
      dir.up do
        set_admin_to_true_for_each_admin
      end
      dir.down do
        set_role
        set_account_id
      end
    end

    remove_column :users, :role, :string, default: 'editor', null: false
    remove_column :users, :account_id, :integer
  end

  private

  def add_account_member_membership_for_each_user
    execute(<<-SQL)
      INSERT INTO pageflow_memberships (role, user_id, entity_id, entity_type, created_at)
      SELECT 'member', id, account_id, 'Pageflow::Account', created_at FROM users
    SQL
  end

  def update_membership_role_to_manager_for_each_account_manager
    execute(<<-SQL)
      UPDATE pageflow_memberships INNER JOIN users ON
      pageflow_memberships.user_id = users.id AND
      pageflow_memberships.entity_type = 'Pageflow::Account' AND
      users.role = 'account_manager'
      SET pageflow_memberships.role = 'manager'
    SQL
  end

  def set_admin_to_true_for_each_admin
    execute(<<-SQL)
      UPDATE users SET users.admin = TRUE WHERE users.role = 'admin'
    SQL
  end

  def set_account_id
    execute(<<-SQL)
      UPDATE users INNER JOIN pageflow_memberships ON
      pageflow_memberships.entity_type = 'Pageflow::Account' AND
      pageflow_memberships.role = 'member' AND
      users.id = pageflow_memberships.user_id
      SET users.account_id = pageflow_memberships.entity_id
    SQL
    execute(<<-SQL)
      UPDATE users INNER JOIN pageflow_memberships ON
      pageflow_memberships.entity_type = 'Pageflow::Account' AND
      pageflow_memberships.role = 'previewer' AND
      users.id = pageflow_memberships.user_id
      SET users.account_id = pageflow_memberships.entity_id
    SQL
    execute(<<-SQL)
      UPDATE users INNER JOIN pageflow_memberships ON
      pageflow_memberships.entity_type = 'Pageflow::Account' AND
      pageflow_memberships.role = 'editor' AND
      users.id = pageflow_memberships.user_id
      SET users.account_id = pageflow_memberships.entity_id
    SQL
    execute(<<-SQL)
      UPDATE users INNER JOIN pageflow_memberships ON
      pageflow_memberships.entity_type = 'Pageflow::Account' AND
      pageflow_memberships.role = 'publisher' AND
      users.id = pageflow_memberships.user_id
      SET users.account_id = pageflow_memberships.entity_id
    SQL
    execute(<<-SQL)
      UPDATE users INNER JOIN pageflow_memberships ON
      pageflow_memberships.entity_type = 'Pageflow::Account' AND
      pageflow_memberships.role = 'manager' AND
      users.id = pageflow_memberships.user_id
      SET users.account_id = pageflow_memberships.entity_id
    SQL
    execute(<<-SQL)
      DELETE FROM pageflow_memberships
      WHERE pageflow_memberships.entity_type = 'Pageflow::Account'
    SQL
  end

  def set_role
    execute(<<-SQL)
      UPDATE users SET users.role = 'editor'
    SQL
    execute(<<-SQL)
      UPDATE users INNER JOIN pageflow_memberships ON
      users.id = pageflow_memberships.user_id AND
      pageflow_memberships.entity_type = 'Pageflow::Account' AND
      pageflow_memberships.role = 'manager'
      SET users.role = 'account_manager'
    SQL
    execute(<<-SQL)
      UPDATE users SET users.role = 'admin' WHERE users.admin = TRUE;
    SQL
  end
end
