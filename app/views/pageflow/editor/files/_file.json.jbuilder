json.partial!(partial: 'pageflow/files/file',
              object: file,
              locals: {file_type: file_type})

json.call(file,
          :state,
          :rights,
          :usage_id)

if file.can_upload?
  json.direct_upload_config(file.direct_upload_config)
end

json.retryable(file.retryable?)
json.file_name(file.file_name)

if file.url.present?
  json.url(file.url)
end

if file.original_url.present?
  json.original_url(file.original_url)
end

if file_type.editor_partial.present?
  json.partial!(object: file, partial: file_type.editor_partial)
end

if file.respond_to?(:thumbnail_url)
  json.thumbnail_url(asset_path(file.thumbnail_url(:thumbnail)))
  json.link_thumbnail_url(asset_path(file.thumbnail_url(:link_thumbnail_large)))
end
