class AddConfirmedByToEncodedFiles < ActiveRecord::Migration
  def change
    add_reference :pageflow_video_files, :confirmed_by
    add_reference :pageflow_audio_files, :confirmed_by
  end
end
