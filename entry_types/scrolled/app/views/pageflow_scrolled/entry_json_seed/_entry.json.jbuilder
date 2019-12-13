json.array!(entry.sections) do |section|
  json.merge! sections_seed(section).merge(section_content_elements_seed(section))
end
