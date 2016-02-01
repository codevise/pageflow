class AddCacheCounters < ActiveRecord::Migration
  def self.up
    add_column :pageflow_accounts, :users_count, :integer, :default => 0, :null => false
    add_column :pageflow_accounts, :entries_count, :integer, :default => 0, :null => false
  end

  def self.down
    remove_column :pageflow_accounts, :users_count
    remove_column :pageflow_accounts, :entries_count
  end
end
