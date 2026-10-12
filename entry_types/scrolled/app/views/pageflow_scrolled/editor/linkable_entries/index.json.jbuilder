json.key_format!(camelize: :lower)

json.array!(@entries) do |entry|
  json.partial!('pageflow_scrolled/entry_json_seed/linked_entry', **scrolled_linked_entry(entry))
end
