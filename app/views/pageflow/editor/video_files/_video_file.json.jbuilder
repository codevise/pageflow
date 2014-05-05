json.(video_file, :id, :state, :rights, :usage_id)
json.encoding_progress(video_file.encoding_progress.to_i)
json.file_name(video_file.attachment.original_filename)

json.format(file_format(video_file))
json.dimensions(file_dimensions(video_file))
json.duration(file_duration(video_file))

if video_file.attachment_on_s3.present?
  json.url(video_file.attachment_on_s3.url)
end

if video_file.state == 'encoded'
  json.sources(video_file_sources(video_file)) do |source|
    json.src source[:high_src]
    json.type source[:type]
  end
end

if video_file.poster.present?
  json.thumbnail_url(video_file.poster.url(:thumbnail))
  json.link_thumbnail_url(video_file.poster.url(:link_thumbnail_large))
  json.poster_url(video_file.poster.url(:large))
end
