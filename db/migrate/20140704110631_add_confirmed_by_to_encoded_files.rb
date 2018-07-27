class AddConfirmedByToEncodedFiles < ActiveRecord::Migration[4.2]
  def change
    add_reference :pageflow_video_files, :confirmed_by
    add_reference :pageflow_audio_files, :confirmed_by
  end
end
