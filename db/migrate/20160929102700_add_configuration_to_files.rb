class AddConfigurationToFiles < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_audio_files, :configuration, :text
    add_column :pageflow_image_files, :configuration, :text
    add_column :pageflow_video_files, :configuration, :text
  end
end
