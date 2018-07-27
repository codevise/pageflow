class AddOutputPresencesToVideoFiles < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_video_files, :output_presences, :text
  end
end
