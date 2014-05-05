json.(entry, :id, :title, :summary, :credits, :published_until, :manual_start, :slug)
json.default_file_rights entry.account.default_file_rights
json.published(entry.published?)
