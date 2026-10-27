json.key_format!(camelize: :lower)

json.array!(@content_elements) do |content_element|
  json.type_name content_element.type_name
  json.configuration content_element.configuration
end
