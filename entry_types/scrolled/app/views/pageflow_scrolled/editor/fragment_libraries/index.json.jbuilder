json.key_format!(camelize: :lower)

json.array!(@libraries) do |library|
  json.id library.id
  json.title library.title

  json.collections do
    json.storylines do
      json.array!(library.storylines) do |storyline|
        json.partial! 'pageflow_scrolled/storylines/storyline', storyline:
      end
    end

    json.chapters do
      json.array!(library.chapters) do |chapter|
        json.partial! 'pageflow_scrolled/chapters/chapter', chapter:
      end
    end

    json.sections do
      json.array!(library.sections) do |section|
        json.partial! 'pageflow_scrolled/sections/section', section:
      end
    end

    json.content_elements do
      json.array!(library.content_elements) do |content_element|
        json.partial! 'pageflow_scrolled/content_elements/content_element',
                      content_element:
      end
    end

    files_json_seed(json, library.entry)
  end
end
