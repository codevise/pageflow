json.(image_file, :width, :height)

json.dimensions(file_dimensions(image_file))

if image_file.processed_attachment.present?
  json.thumbnail_url(image_file.attachment.url(:thumbnail))
  json.link_thumbnail_url(image_file.attachment.url(:link_thumbnail_large))
end
