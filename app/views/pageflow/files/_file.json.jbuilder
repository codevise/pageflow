attributes = [:id,
              :basename,
              :configuration,
              :parent_file_id,
              :parent_file_model_type] +
             file_type.custom_attributes

json.call(file, *attributes)

json.is_ready(file.ready?)

if file_type.partial.present?
  json.partial!(object: file, partial: file_type.partial)
end
