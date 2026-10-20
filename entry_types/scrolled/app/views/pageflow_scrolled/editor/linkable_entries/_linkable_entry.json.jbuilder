json.id linkable_entry.id
json.title linkable_entry.title
json.type_name linkable_entry.type_name
json.url social_share_entry_url(linkable_entry.published_entry)
json.preview_url main_app.preview_admin_entry_path(linkable_entry.entry)
json.publication_state linkable_entry.publication_state
json.signature PageflowScrolled::EntryLinkSignature.generate(linkable_entry.id)
