json.key_format!(camelize: :lower)

json.partial!('pageflow_scrolled/chapters/chapter', chapter:)

json.sections do
  json.array!(chapter.sections) do |section|
    json.partial!('pageflow_scrolled/editor/sections/section_with_content_elements', section:)
  end
end
