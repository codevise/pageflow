json.(page_type,
      :name,
      :translation_key_prefix,
      :translation_key,
      :help_entry_translation_key,
      :description_translation_key,
      :category_translation_key)

json.thumbnail_candidates(page_type.thumbnail_candidates) do |candidate|
  json.(candidate, :attribute, :file_collection)

  if (condition = candidate[:unless] || candidate[:if])
    json.condition do
      json.(condition, :attribute, :value)
      json.negated(!!candidate[:unless])
    end
  end
end

page_type_json_seed(json, page_type)
