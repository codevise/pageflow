Pageflow.config.file_types.each do |file_type|
  json.set!(file_type.collection_name,
            @entry.files(file_type.model),
            partial: file_type.editor_partial,
            as: file_type.param_key)
end
