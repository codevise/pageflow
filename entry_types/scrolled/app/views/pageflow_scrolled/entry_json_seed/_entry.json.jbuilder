json.key_format!(camelize: :lower)

json.chapters do
  json.array!(chapters) do |chapter|
    json.partial! 'pageflow_scrolled/chapters/chapter', chapter: chapter
  end
end

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

files_json_seed(json, entry) unless options[:skip_files]
