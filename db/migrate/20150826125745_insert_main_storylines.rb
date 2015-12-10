class InsertMainStorylines < ActiveRecord::Migration
  def up
    create_storyline_for_each_revision
    update_each_chapter_to_reference_a_storyline
  end

  private

  def create_storyline_for_each_revision
    # We can reuse entry ids as storyline perma ids since all
    # storylines of an entry's revisions are supposed to have the same
    # perma id.
    execute(<<-SQL)
      INSERT INTO pageflow_storylines
        (perma_id, revision_id, position, configuration, created_at, updated_at)
        SELECT entry_id, id, 1, '{"main":true}', created_at, updated_at
        FROM pageflow_revisions
    SQL
  end

  def update_each_chapter_to_reference_a_storyline
    execute(<<-SQL)
      UPDATE pageflow_chapters SET storyline_id =
        (SELECT id FROM pageflow_storylines
         WHERE pageflow_storylines.revision_id = pageflow_chapters.revision_id)
    SQL
  end
end
