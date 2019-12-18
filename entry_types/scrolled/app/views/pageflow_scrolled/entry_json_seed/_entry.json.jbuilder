json.array!(sections) do |section|
  json.merge! section.configuration
  json.foreground do
    json.array! section.content_elements.each do |content_element|
      json.type content_element.type_name
      json.props content_element.configuration
    end
  end
end
