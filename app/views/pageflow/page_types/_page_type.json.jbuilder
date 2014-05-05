json.(page_type, :name, :translation_key)

if page_type.json_seed_template
  json.partial!(:template => page_type.json_seed_template, :locals => {:page_type => page_type})
end
