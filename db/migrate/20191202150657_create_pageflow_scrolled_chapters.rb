class CreatePageflowScrolledChapters < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_scrolled_chapters do |t|
      t.integer :perma_id                           # deep link / anchor for menu
      t.integer :position, default: 0, null: false  # position within entry
      t.text :configuration                         # schemaless JSON
                                                    # - title (title for editor-overview)
      t.timestamps
    end
  end
end
