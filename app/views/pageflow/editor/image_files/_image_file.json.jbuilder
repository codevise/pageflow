json.(image_file, :width, :height, :panorama_url)

json.dimensions(file_dimensions(image_file))

# Uncropped, unlike the thumbnail styles used elsewhere in the editor.
json.preview_url(image_file.attachment.url(:medium)) if image_file.ready?
