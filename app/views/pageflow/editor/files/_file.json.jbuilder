json.partial!(partial: 'pageflow/files/file',
              object: file,
              locals: {file_type:})

json.call(file,
          :state,
          :rights,
          :usage_id)

json.direct_upload_config(file.direct_upload_config) if file.can_upload?

json.retryable(file.retryable?)
json.file_name(file.file_name)

json.url(file.url) if file.url.present?

json.original_url(file.original_url) if file.original_url.present?

json.partial!(object: file, partial: file_type.editor_partial) if file_type.editor_partial.present?

if file.respond_to?(:thumbnail_url)
  json.thumbnail_url(asset_path(file.thumbnail_url(:thumbnail)))
  json.link_thumbnail_url(asset_path(file.thumbnail_url(:link_thumbnail_large)))
end
