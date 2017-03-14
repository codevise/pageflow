json.key_format!(camelize: :lower)
json.(Pageflow.config, :confirm_encoding_jobs, :available_locales, :available_public_locales)
json.file_types(Pageflow.config.file_types, :collection_name, :type_name, :param_key, :i18n_key)
json.default_author_meta_tag Pageflow.config.default_author_meta_tag
json.default_publisher_meta_tag Pageflow.config.default_publisher_meta_tag
json.default_keywords_meta_tag Pageflow.config.default_keywords_meta_tag
json.themes(Pageflow.config.themes, :name, :preview_image_path)
