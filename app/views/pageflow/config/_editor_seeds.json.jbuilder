json.key_format!(camelize: :lower)
json.call(Pageflow.config,
          :confirm_encoding_jobs,
          :available_locales,
          :available_public_locales,
          :available_text_track_kinds,
          :available_share_providers)
json.file_types Pageflow.config.file_types do |file_type|
  json.collection_name file_type.collection_name
  json.top_level_type file_type.top_level_type
  json.type_name file_type.type_name
  json.param_key file_type.param_key
  json.i18n_key file_type.i18n_key
  json.nested_file_types file_type.nested_file_types do |nested_file_type|
    json.collection_name nested_file_type.collection_name
  end
end
json.default_author_meta_tag Pageflow.config.default_author_meta_tag
json.default_publisher_meta_tag Pageflow.config.default_publisher_meta_tag
json.default_keywords_meta_tag Pageflow.config.default_keywords_meta_tag
json.themes(Pageflow.config.themes, :name, :preview_image_path)
json.edit_lock_polling_interval_in_seconds Pageflow.config.edit_lock_polling_interval
