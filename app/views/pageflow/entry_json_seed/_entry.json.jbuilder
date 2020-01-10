common_entry_seed(json, entry)

json.entry entry_attributes_seed(entry)
json.theme entry_theme_seed(entry)

json.storylines entry_storylines_seed(entry)
json.chapters entry_chapters_seed(entry)
json.pages entry_pages_seed(entry)
json.widgets entry_widgets_seed(entry)

json.file_ids entry_file_ids_seed(entry)

json.files do
  files_json_seed(json, entry)
end
