json.exceeding(@entry_publication.exceeding?)
json.quota do
  json.(@entry_publication.quota, :state_description, :state)
end
json.entry do
  json.(@entry_publication.entry, :published_until)
  json.published(@entry_publication.entry.published?)
end
json.exhausted_html(render_html_partial('pageflow/editor/quotas/published_entries_exhausted',
                                        entry: @entry_publication.entry,
                                        quota: @entry_publication.quota,
                                        account: @entry_publication.quota.account))
json.published_message_html(render_html_partial('published_message',
                                                 entry: @entry_publication.entry,
                                                 account: @entry_publication.quota.account))
