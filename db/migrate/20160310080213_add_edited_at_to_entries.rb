class AddEditedAtToEntries < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_entries, :edited_at, :datetime

    execute(<<-SQL)
      UPDATE pageflow_entries SET edited_at = updated_at;
    SQL
  end
end
