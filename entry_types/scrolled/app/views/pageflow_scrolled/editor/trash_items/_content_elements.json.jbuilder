json.array!(content_elements) do |content_element|
  json.partial!('pageflow_scrolled/content_elements/content_element', content_element:)
end
