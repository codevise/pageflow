class CreatePageflowScrolledContentElements < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_scrolled_content_elements do |t|
      t.references :section
      t.integer :perma_id   # deep link / anchor for menu
      t.string :type_name   # maps to React-component-name
      t.text :configuration # schemaless JSON
                            # - Heading:
                            #   - (HTML) text content
                            #   - first: true
                            # - TextBlock:
                            #   - (HTML) text content
                            # - InlineVideo
                            #   - position (full)
                            #   - autoplay (true/false)
                            #   - controls (true/false)

      t.timestamps
    end
  end
end
