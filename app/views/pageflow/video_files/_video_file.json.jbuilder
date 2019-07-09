json.call(video_file, :width, :height, :duration_in_ms)
json.created_at video_file.created_at.try(:utc).try(:iso8601, 0)
json.variants video_file.present_outputs + [:poster_medium, :poster_large, :poster_ultra, :print]
