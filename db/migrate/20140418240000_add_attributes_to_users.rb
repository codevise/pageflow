class AddAttributesToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :failed_attempts, :integer, default: 0
    add_column :users, :locked_at, :datetime

    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :suspended_at, :datetime
    add_column :users, :locale, :string
    add_column :users, :admin, :boolean, null: false, default: false
  end
end
