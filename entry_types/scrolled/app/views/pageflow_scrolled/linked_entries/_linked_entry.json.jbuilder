json.partial!('pageflow_scrolled/linked_entries/attributes', linked_entry:)

if linked_entry.chapters.any?
  json.chapters(linked_entry.chapters) do |chapter|
    json.partial!('pageflow_scrolled/linked_entries/chapter', chapter:)
  end
end
