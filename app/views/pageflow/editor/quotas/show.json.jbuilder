json.name(@quota_name)

json.state_description(@quota.state_description(@quota_name, @account))
json.state(@quota.exceeded?(@quota_name, @account) ? 'exceeded' : 'ok')
json.exceeded_html(render_html_partial('pageflow/editor/quotas/published_entries_exceeded', :account => @account))
