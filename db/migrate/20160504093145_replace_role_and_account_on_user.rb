class ReplaceRoleAndAccountOnUser < ActiveRecord::Migration
  def up
    add_account_member_membership_for_each_user
    update_membership_role_to_manager_for_each_account_manager

    add_column :users, :admin, :boolean, null: false, default: false

    set_admin_to_true_for_each_admin

    remove_column :users, :role, :string, default: 'editor', null: false
    remove_column :users, :account_id, :integer
  end

  def down
    raise ActiveRecord::IrreversibleMigration
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
end
