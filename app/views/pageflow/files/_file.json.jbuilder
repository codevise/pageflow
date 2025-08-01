json.call(file,
          :id,
          :perma_id,
          :basename,
          :extension,
          :rights,
          :configuration,
          :parent_file_id,
          :parent_file_model_type)

json.display_name(file.display_name.presence || file.file_name)

json.is_ready(file.ready?)

json.partial!(object: file, partial: file_type.partial) if file_type.partial.present?
