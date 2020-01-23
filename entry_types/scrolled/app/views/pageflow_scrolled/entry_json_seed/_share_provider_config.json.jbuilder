json.key_format!(camelize: :lower)

json.provider provider
json.providerName provider.to_s.camelize
json.shareLink social_share_link_url(provider, "http://pageflow-next/#{entry.slug}")
