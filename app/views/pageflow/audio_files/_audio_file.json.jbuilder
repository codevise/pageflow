json.call(audio_file, :duration_in_ms)
json.created_at audio_file.created_at.try(:utc).try(:iso8601, 0)
