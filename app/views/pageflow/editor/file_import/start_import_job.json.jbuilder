json.array! @items do |item|
  json.source_url item[:source_url]

  json.attributes do
    json.partial!(object: item[:file],
                  partial: 'pageflow/editor/files/file',
                  locals: {file_type: item[:file].file_type},
                  as: :file)
  end
end
