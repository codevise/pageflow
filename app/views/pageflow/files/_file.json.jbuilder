json.call(file,
          :id,
          :basename,
          :configuration,
          :parent_file_id,
          :parent_file_model_type)

if file_type.partial.present?
  json.partial!(object: file, partial: file_type.partial)
end
