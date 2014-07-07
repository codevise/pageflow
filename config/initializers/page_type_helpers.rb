Pageflow.after_configure do
  Pageflow.config.page_types.each do |page_type|
    page_type.view_helpers.each do |helper|
      Pageflow::EntriesController.helper(helper)
      Pageflow::RevisionsController.helper(helper)
    end
  end
end
