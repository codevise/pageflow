class AddPermaIdIndexesToRevisionComponents < ActiveRecord::Migration[7.1]
  def change
    # Add composite indexes for perma_id optimization
    add_index :pageflow_chapters, [:storyline_id, :perma_id]
    add_index :pageflow_pages, [:chapter_id, :perma_id]
    add_index :pageflow_scrolled_chapters, [:storyline_id, :perma_id]
    add_index :pageflow_scrolled_content_elements, [:section_id, :perma_id]
    add_index :pageflow_scrolled_sections, [:chapter_id, :perma_id]
    add_index :pageflow_scrolled_storylines, [:revision_id, :perma_id]
    add_index :pageflow_storylines, [:revision_id, :perma_id]
    add_index :pageflow_file_usages, [:revision_id, :file_perma_id]
  end
end
