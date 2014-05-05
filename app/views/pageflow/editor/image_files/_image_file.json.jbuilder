json.(image_file, :id, :state, :rights, :usage_id, :width, :height)
json.file_name(image_file.attachment.original_filename)
json.url(image_file.attachment.url(:large))

json.dimensions(file_dimensions(image_file))

if image_file.processed_attachment.present?
  json.thumbnail_url(image_file.attachment.url(:thumbnail))
  json.link_thumbnail_url(image_file.attachment.url(:link_thumbnail_large))
end
