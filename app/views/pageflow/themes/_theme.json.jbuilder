json.(theme, :name)
json.preview_image_url(image_url(theme.preview_image_path))
json.preview_thumbnail_url(image_url(theme.preview_thumbnail_path))
json.stylesheet_path(stylesheet_path(theme.stylesheet_path))
