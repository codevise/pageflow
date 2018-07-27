class AddFirstPublishedAtToEntries < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_entries, :first_published_at, :datetime

    execute(<<-SQL)
      UPDATE pageflow_entries SET first_published_at = (
        SELECT MIN(published_at)
        FROM pageflow_revisions
        WHERE pageflow_revisions.entry_id = pageflow_entries.id
        LIMIT 1
      );
    SQL
  end
end
