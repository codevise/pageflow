json.(entry, :id, :entry_title, :published_until, :slug, :enabled_feature_names)

json.pretty_url pretty_entry_url(entry)

json.default_file_rights entry.account.default_file_rights
json.published(entry.published?)
json.publishable(can?(:publish, entry.to_model))
json.password_protected(entry.password_digest.present?)

json.metadata do
  json.(entry,
        :title, :locale, :summary, :credits, :author, :publisher, :keywords, :share_providers,
        :share_url, :share_image_id, :share_image_x, :share_image_y, :configuration)
  json.theme_name entry.theme.name
end
