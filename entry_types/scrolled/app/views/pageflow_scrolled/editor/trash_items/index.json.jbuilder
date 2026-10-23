json.key_format!(camelize: :lower)

json.array!(@items) do |item|
  json.call(item, :id, :kind, :origin_perma_id, :origin_position, :trashed_at)
  json.title item.title

  json.sections do
    json.array!(item.sections) do |section|
      json.partial!('pageflow_scrolled/editor/sections/section_with_content_elements',
                    section:)
    end
  end
end
