class MoveAllCnamesIntoDomains < ActiveRecord::Migration
  def up
    res = execute("select id, cname, additional_cnames from pageflow_themings")
    res.each do |fields|
      id, cname, additional = *fields
      statement = prepare("insert into pageflow_domains (theming_id, name) values (?, ?)")

      statement.execute(id, cname)
      additional.split(',').each do |name|
        statement.execute(id, name)
      end

      remove_column :pageflow_themings, :cname
      remove_column :pageflow_themings, :additional_cnames
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
