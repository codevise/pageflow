Pageflow.after_global_configure do |config|
  config.page_types.each do |page_type|
    page_type.view_helpers.each do |helper|
      PageflowPaged::EntriesController.helper(helper)
      PageflowPaged::Editor::EntriesController.helper(helper)
    end
  end
end
