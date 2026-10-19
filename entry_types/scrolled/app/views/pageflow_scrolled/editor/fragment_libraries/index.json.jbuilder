json.key_format!(camelize: :lower)

json.array!(@libraries) do |library|
  json.id library.id
  json.title library.title

  json.collections do
    json.partial!('pageflow_scrolled/entry_json_seed/content_collections',
                  content: library.content)

    scrolled_linked_entries_json_seed(json, library.entry, library.content.content_elements)

    files_json_seed(json, library.entry)
  end
end
