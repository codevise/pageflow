json.storylines do
  json.array!(content.storylines) do |storyline|
    json.partial!('pageflow_scrolled/storylines/storyline', storyline:)
  end
end

json.chapters do
  json.array!(content.chapters) do |chapter|
    json.partial!('pageflow_scrolled/chapters/chapter', chapter:)
    json.chapter_slug content.chapter_slug_for(chapter)
  end
end

json.sections do
  json.array!(content.sections) do |section|
    json.partial!('pageflow_scrolled/sections/section', section:)
  end
end

json.content_elements do
  json.array!(content.content_elements) do |content_element|
    json.partial!('pageflow_scrolled/content_elements/content_element', content_element:)
  end
end
