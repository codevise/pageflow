class ReplaceRoleAndAccountOnUser < ActiveRecord::Migration
  def change
    add_account_member_membership_for_each_user
    update_membership_role_to_manager_for_each_account_manager
    add_column :users, :admin, :boolean, null: false, default: false
    set_admin_to_true_for_each_admin
    remove_column(:users, :role)
    remove_column(:users, :account_id)
  end

  private

  def add_account_member_membership_for_each_user
    User.all.each do |user|
      Pageflow::Membership.create(user: user, entity: user.account, role: 'member')
    end
  end

  def update_membership_role_to_manager_for_each_account_manager
    User.where(role: 'account_manager').each do |account_manager|
      Pageflow::Membership.where(user: account_manager, entity: account_manager.account)
        .each do |membership|
        membership.update(role: 'manager')
      end
    end
  end

  def set_admin_to_true_for_each_admin
    User.where(role: 'admin').each do |admin|
      admin.update(admin: true)
    end
  end
end
