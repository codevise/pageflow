# Fix bug in EnsureScrolledEntriesHaveMainStoryline migration which created
# main storylines at position 1 instead of 0. Main storylines should be at
# position 0, excursion storylines at position 1.
class FixMainStorylinePositions < ActiveRecord::Migration[7.1]
  def up
    execute(<<-SQL)
      UPDATE pageflow_scrolled_storylines
      SET position = 0
      WHERE configuration IS NOT NULL
        AND configuration LIKE '%"main"%true%'
        AND position != 0;
    SQL
  end

  def down; end
end
