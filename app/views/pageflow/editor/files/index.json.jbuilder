Pageflow.config.file_types.each do |file_type|
  json.set!(file_type.collection_name,
            @entry.find_files(file_type.model),
            partial: 'pageflow/editor/files/file',
            as: :file,
            file_type:)
end
