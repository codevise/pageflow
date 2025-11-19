class EnsureScrolledEntriesHaveExcursionStoryline < ActiveRecord::Migration[7.1]
  def up
    execute(<<-SQL)
      INSERT INTO pageflow_scrolled_storylines (revision_id, perma_id, position, created_at, updated_at)
      SELECT r.id, main_storyline.perma_id + 1, 1, NOW(), NOW()
      FROM pageflow_revisions r
      INNER JOIN pageflow_entries e ON r.entry_id = e.id
      INNER JOIN pageflow_scrolled_storylines main_storyline ON main_storyline.revision_id = r.id AND main_storyline.position = 0
      LEFT JOIN pageflow_scrolled_storylines excursion_storyline ON excursion_storyline.revision_id = r.id AND excursion_storyline.position = 1
      WHERE e.type_name = 'scrolled' AND excursion_storyline.id IS NULL;
    SQL
  end

  def down; end
end
