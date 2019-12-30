json.key_format!(camelize: :lower)

json.sections do
  json.array!(sections, :id, :perma_id, :position, :configuration)
end

json.content_elements do
  json.array!(content_elements, :id, :perma_id, :type_name, :position, :section_id, :configuration)
end
