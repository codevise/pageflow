json.key_format!(camelize: :lower)

json.sections do
  json.array!(sections) do |section|
    json.partial! 'pageflow_scrolled/sections/section', section: section
  end
end

json.content_elements do
  json.array!(content_elements) do |content_element|
    json.partial! 'pageflow_scrolled/content_elements/content_element',
                  content_element: content_element
  end
end
