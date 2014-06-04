class MoveCnameFromAccountToTheming < ActiveRecord::Migration
  def up
    add_column :pageflow_themings, :cname, :string, null: false, default: ''
    add_index :pageflow_themings, :cname

    remove_index :pageflow_accounts, :cname
    remove_column :pageflow_accounts, :cname
  end

  def down
    add_column :pageflow_accounts, :cname, :string, null: false, default: ''
    add_index :pageflow_accounts, :cname

    remove_index :pageflow_themings, :cname
    remove_column :pageflow_themings, :cname
  end
end
