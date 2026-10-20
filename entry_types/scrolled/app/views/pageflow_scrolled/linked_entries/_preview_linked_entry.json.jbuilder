json.partial!('pageflow_scrolled/linked_entries/attributes', linked_entry:)

json.title linked_entry.title
json.preview_url main_app.preview_admin_entry_path(linked_entry.entry)
json.publication_state linked_entry.publication_state

if linked_entry.chapters.any?
  json.chapters(linked_entry.chapters) do |chapter|
    json.partial!('pageflow_scrolled/linked_entries/chapter', chapter:)
    json.preview_slug chapter.preview_slug
    json.title chapter.title
  end
end
