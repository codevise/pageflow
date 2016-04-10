class AddRoleToMembership < ActiveRecord::Migration
  def change
    add_column :pageflow_memberships, :role, :string, null: false, default: 'editor'
    update_each_membership_to_have_default_role
  end

  private

  def update_each_membership_to_have_default_role
    execute(<<-SQL)
      UPDATE pageflow_memberships SET role = 'editor'
    SQL
  end
end
