json.key_format!(camelize: :lower)

json.array!(@libraries) do |library|
  json.id library.id
  json.title library.title

  json.collections do
    json.partial!('pageflow_scrolled/entry_json_seed/content_collections',
                  content: library.content)

    json.linked_entries(scrolled_linked_entries(library.entry,
                                                library.content.content_elements)) do |linked_entry|
      json.partial!('pageflow_scrolled/entry_json_seed/linked_entry', **linked_entry)
    end

    files_json_seed(json, library.entry)
  end
end
