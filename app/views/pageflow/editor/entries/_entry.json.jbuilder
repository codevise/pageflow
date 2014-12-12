json.(entry, :id, :published_until, :slug)

json.pretty_url pretty_entry_url(entry)

json.default_file_rights entry.account.default_file_rights
json.published(entry.published?)

json.configuration do
  json.(entry, :title, :summary, :credits, :manual_start, :emphasize_chapter_beginning, :emphasize_new_pages, :share_image_id, :share_image_x, :share_image_y, :locale)
  json.home_url entry.home_button.url_value
  json.home_button_enabled entry.home_button.enabled_value
end
