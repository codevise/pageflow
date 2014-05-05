json.(audio_file, :id, :state, :rights, :usage_id)
json.encoding_progress(audio_file.encoding_progress.to_i)
json.file_name audio_file.attachment.original_filename

json.format(file_format(audio_file))
json.duration(file_duration(audio_file))

if audio_file.attachment_on_s3.present?
  json.url(audio_file.attachment_on_s3.url)
end

if audio_file.state == 'encoded'
  json.sources(audio_file_sources(audio_file)) do |source|
    json.src source[:src]
    json.type source[:type]
  end
end
