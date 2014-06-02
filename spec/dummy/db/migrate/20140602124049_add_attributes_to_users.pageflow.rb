# This migration comes from pageflow (originally 20140418240000)
class AddAttributesToUsers < ActiveRecord::Migration
  def change
    add_column :users, :failed_attempts, :integer, default: 0
    add_column :users, :locked_at, :datetime

    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :suspended_at, :datetime
    add_column :users, :account_id, :integer
    add_column :users, :role, :string, default: "editor", null: false

    add_index :users, [:account_id], name: "index_pageflow_users_on_account_id", using: :btree
    add_index :users, [:email], name: "index_pageflow_users_on_email", unique: true, using: :btree
  end
end
