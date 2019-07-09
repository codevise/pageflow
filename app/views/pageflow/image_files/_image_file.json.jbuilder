json.call(image_file, :width, :height)
json.created_at image_file.created_at.try(:utc).try(:iso8601, 0)
