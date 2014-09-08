json.(entry, :id, :title, :summary, :credits, :published_until, :manual_start, :slug)

json.pretty_url pretty_entry_url(entry)

json.home_url entry.home_button.url_value
json.home_button_enabled entry.home_button.enabled_value

json.default_file_rights entry.account.default_file_rights
json.published(entry.published?)
