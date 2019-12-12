class CreatePageflowScrolledSections < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_scrolled_sections do |t|
      t.references :revision                         # RevisionComponent
      t.integer :perma_id                           # revision_component
      t.integer :position, default: 0, null: false  # position within chapter
      t.text    :configuration                      # schemaless JSON
                                                    # - title       (title for editor-overview)
                                                    # - transition  (transition from last section)
                                                    # - full_height (min viewport height: true/false)
                                                    # - layout      (section layout on wide screens (left-/right-aligned, centered))
                                                    # - appearance  (section appearance / text-background)
                                                    # - invert      (text-color-/text-background-inversion (black on white or white on black))
                                                    # - backdrop:
                                                    #   - type (image/video/color)
                                                    #   - image-/video-usage-perma_id
                                                    #   - color-code
      t.timestamps
    end
  end
end
