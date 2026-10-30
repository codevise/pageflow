json.array!(@sections) do |section|
  json.partial! 'pageflow_scrolled/editor/sections/section_with_content_elements',
                section:
end
