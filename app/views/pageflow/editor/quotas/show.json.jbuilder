json.(@quota, :name, :state_description, :state)
json.exhausted_html(render_html_partial('pageflow/editor/quotas/published_entries_exhausted', :quota => @quota, :account => @account))
