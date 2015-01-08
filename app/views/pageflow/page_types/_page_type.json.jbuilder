json.(page_type, :name, :translation_key, :description_translation_key, :category_translation_key)

json.thumbnail_candidates(page_type.thumbnail_candidates) do |candidate|
  json.(candidate, :attribute, :file_collection)
end

if page_type.json_seed_template
  json.partial!(:template => page_type.json_seed_template, :locals => {:page_type => page_type})
end
