json.call(image_file, :width, :height)
json.processed_extension image_file.output_present?(:webp) ? 'webp' : 'JPG'
