json.call(image_file, :width, :height)
json.processed_extension image_file.output_present?(:webp) ? 'webp' : 'JPG'
json.created_at image_file.created_at.try(:utc).try(:iso8601, 0)
