json.key_format!(camelize: :lower)
json.(Pageflow.config, :confirm_encoding_jobs, :available_locales)
json.file_types(Pageflow.config.file_types, :collection_name, :type_name, :param_key, :i18n_key)
