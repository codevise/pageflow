Pageflow.after_global_configure do |config|
  config.page_types.each do |page_type|
    page_type.view_helpers.each do |helper|
      Pageflow::EntriesController.helper(helper)
      Pageflow::RevisionsController.helper(helper)
    end
  end
end
