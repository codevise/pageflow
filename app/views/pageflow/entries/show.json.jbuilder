Pageflow.config.file_types.each do |file_type|
  json.set!(file_type.collection_name) do
    json.partial!(collection: @entry.files(file_type.model),
                  partial: 'pageflow/editor/files/file',
                  locals: {file_type: file_type},
                  as: :file)
  end
end
