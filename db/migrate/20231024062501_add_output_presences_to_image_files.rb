class AddOutputPresencesToImageFiles < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_image_files, :output_presences, :text
  end
end
