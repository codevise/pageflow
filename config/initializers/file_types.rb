Pageflow.after_configure do |config|
  config.page_types.each do |page_type|
    page_type.file_types.each do |file_type|
      config.file_types.register(file_type)
    end
  end
end
