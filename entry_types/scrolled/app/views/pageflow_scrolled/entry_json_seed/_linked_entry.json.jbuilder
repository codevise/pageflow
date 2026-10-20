json.id entry.id
json.perma_id entry.id
json.url url

if local_assigns.key?(:preview_url)
  json.title entry.entry.title
  json.preview_url preview_url
  json.publication_state publication_state
end
