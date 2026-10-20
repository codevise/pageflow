json.key_format!(camelize: :lower)

json.array!(@linkable_entries) do |linkable_entry|
  json.partial!('pageflow_scrolled/editor/linkable_entries/linkable_entry', linkable_entry:)
end
