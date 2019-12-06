Pageflow.after_configure do |config|
  config.page_types.each do |page_type|
    page_type.revision_components.each do |component|
      config.revision_components.register(component)
    end
  end
end
