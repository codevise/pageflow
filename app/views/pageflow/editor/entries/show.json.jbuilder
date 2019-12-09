Pageflow.config.file_types.each do |file_type|
  json.set!(file_type.collection_name, @entry.find_files(file_type.model)) do |file|
    json.cache!(file) do
      json.partial!(object: file,
                    partial: 'pageflow/editor/files/file',
                    locals: {file_type: file_type},
                    as: :file)
    end
  end
end
