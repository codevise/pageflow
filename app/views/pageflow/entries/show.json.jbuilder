json.image_files @entry.image_files.with_usage_id, :partial => 'pageflow/editor/image_files/image_file', :as => :image_file
json.audio_files @entry.audio_files.with_usage_id, :partial => 'pageflow/editor/audio_files/audio_file', :as => :audio_file
json.video_files @entry.video_files.with_usage_id, :partial => 'pageflow/editor/video_files/video_file', :as => :video_file
