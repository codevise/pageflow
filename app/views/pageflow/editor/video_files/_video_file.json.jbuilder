json.(video_file, :width, :height)
json.encoding_progress(video_file.encoding_progress.to_i)

json.format(file_format(video_file))
json.dimensions(file_dimensions(video_file))
json.duration(file_duration(video_file))

if video_file.state == 'encoded'
  json.sources(video_file_sources(video_file)) do |source|
    json.src source[:high_src]
    json.type source[:type]
  end
end

json.poster_url(video_file.poster.url(:large)) if video_file.poster.present?
