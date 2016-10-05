class AddRoleToMembership < ActiveRecord::Migration
  def change
    add_column :pageflow_memberships, :role, :string, null: false, default: 'editor'

    reversible do |dir|
      dir.up do
        update_each_membership_to_have_default_role
      end
    end
  end

  private

  def update_each_membership_to_have_default_role
    execute(<<-SQL)
      UPDATE pageflow_memberships SET role = 'publisher'
    SQL
  end
end
