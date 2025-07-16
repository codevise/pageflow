json.key_format!(camelize: :lower)

json.partial!('pageflow_scrolled/sections/section', section:)

json.content_elements do
  json.array!(section.content_elements) do |content_element|
    json.partial! 'pageflow_scrolled/content_elements/content_element',
                  content_element:
  end
end
