json.call(file,
          :id,
          :perma_id,
          :basename,
          :rights,
          :configuration,
          :parent_file_id,
          :parent_file_model_type)

json.is_ready(file.ready?)

if file_type.partial.present?
  json.partial!(object: file, partial: file_type.partial)
end
