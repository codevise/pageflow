class AddEntryIdAndStateIndexToImageFiles < ActiveRecord::Migration[7.2]
  def change
    add_index :pageflow_image_files, [:entry_id, :state]
  end
end
