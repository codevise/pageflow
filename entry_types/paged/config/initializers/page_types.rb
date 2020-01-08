Pageflow.after_global_configure do |config|
  config.for_entry_type(PageflowPaged.entry_type) do |entry_type_config|
    entry_type_config.page_types.each do |page_type|
      page_type.view_helpers.each do |helper|
        PageflowPaged::EntriesController.helper(helper)
        PageflowPaged::Editor::EntriesController.helper(helper)
      end
    end
  end
end

Pageflow.after_configure do |config|
  config.for_entry_type(PageflowPaged.entry_type) do |entry_type_config|
    entry_type_config.page_types.setup(entry_type_config)
  end
end
