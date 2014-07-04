# This migration comes from pageflow (originally 20140704110631)
class AddConfirmedByToEncodedFiles < ActiveRecord::Migration
  def change
    add_reference :pageflow_video_files, :confirmed_by
    add_reference :pageflow_audio_files, :confirmed_by
  end
end
