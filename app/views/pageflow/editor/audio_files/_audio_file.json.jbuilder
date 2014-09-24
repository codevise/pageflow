json.encoding_progress(audio_file.encoding_progress.to_i)

json.format(file_format(audio_file))
json.duration(file_duration(audio_file))

if audio_file.state == 'encoded'
  json.sources(audio_file_sources(audio_file)) do |source|
    json.src source[:src]
    json.type source[:type]
  end
end
