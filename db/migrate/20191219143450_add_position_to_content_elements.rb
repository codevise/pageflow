class AddPositionToContentElements < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_scrolled_content_elements, :position, :integer, default: 0, null: false, after: 'perma_id'
  end
end
