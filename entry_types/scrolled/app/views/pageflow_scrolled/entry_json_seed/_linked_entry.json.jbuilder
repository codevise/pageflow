json.id entry.id
json.perma_id entry.id
json.title entry.title
json.url url

if local_assigns.key?(:preview_url)
  json.preview_url preview_url
  json.publication_state publication_state
  json.signature signature
end
