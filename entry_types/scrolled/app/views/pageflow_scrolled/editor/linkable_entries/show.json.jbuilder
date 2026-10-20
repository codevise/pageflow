json.key_format!(camelize: :lower)

json.partial!('pageflow_scrolled/editor/linkable_entries/linkable_entry',
              linkable_entry: @linkable_entry)

json.chapters(@linkable_entry.content.chapters) do |chapter|
  json.perma_id chapter.perma_id
  json.title chapter.configuration['title']
  json.slug @linkable_entry.content.chapter_slug_for(chapter)
  json.signature PageflowScrolled::EntryLinkSignature.generate(@linkable_entry.id,
                                                               chapter: chapter.perma_id)
end

json.sections(@linkable_entry.content.sections) do |section|
  json.perma_id section.perma_id
  json.signature PageflowScrolled::EntryLinkSignature.generate(@linkable_entry.id,
                                                               section: section.perma_id)
end

json.collections do
  json.partial!('pageflow_scrolled/entry_json_seed/content_collections',
                content: @linkable_entry.content)

  files_json_seed(json, @linkable_entry.draft)
end
