json.(entry, :id, :entry_title, :published_until, :slug, :enabled_feature_names)

json.pretty_url pretty_entry_url(entry)

json.default_file_rights entry.account.default_file_rights
json.published(entry.published?)
json.publishable(can?(:publish, entry.to_model))
json.password_protected(entry.password_digest.present?)

json.configuration do
  json.(entry,
        :title, :locale, :summary, :credits, :author, :publisher, :keywords,
        :manual_start, :emphasize_chapter_beginning, :emphasize_new_pages,
        :share_url, :share_image_id, :share_image_x, :share_image_y)
  json.home_url entry.home_button.url_value
  json.home_button_enabled entry.home_button.enabled_value
  json.overview_button_enabled entry.overview_button.enabled_value
end
