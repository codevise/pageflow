# This migration comes from pageflow (originally 20140624135425)
class MoveCnameFromAccountToTheming < ActiveRecord::Migration
  def up
    add_column :pageflow_themings, :cname, :string, null: false, default: ''
    add_index :pageflow_themings, :cname

    execute("UPDATE pageflow_themings SET cname = (SELECT cname FROM pageflow_accounts WHERE pageflow_accounts.default_theming_id = pageflow_themings.id LIMIT 1);")

    remove_index :pageflow_accounts, :cname
    remove_column :pageflow_accounts, :cname
  end

  def down
    add_column :pageflow_accounts, :cname, :string, null: false, default: ''
    add_index :pageflow_accounts, :cname

    execute("UPDATE pageflow_accounts SET cname = (SELECT cname FROM pageflow_themings WHERE pageflow_themings.id = pageflow_accounts.default_theming_id);")

    remove_index :pageflow_themings, :cname
    remove_column :pageflow_themings, :cname
  end
end
