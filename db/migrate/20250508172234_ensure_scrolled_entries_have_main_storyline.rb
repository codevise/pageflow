class EnsureScrolledEntriesHaveMainStoryline < ActiveRecord::Migration[5.2]
  def up
    execute(<<-SQL)
      INSERT INTO pageflow_scrolled_storylines (revision_id, perma_id, position, configuration, created_at, updated_at)
      SELECT r.id, 1, 1, '{"main":true}', NOW(), NOW()
      FROM pageflow_revisions r
      INNER JOIN pageflow_entries e ON r.entry_id = e.id
      LEFT JOIN pageflow_scrolled_storylines s ON s.revision_id = r.id
      WHERE e.type_name = 'scrolled' AND s.revision_id IS NULL;
    SQL
  end

  def down; end
end
