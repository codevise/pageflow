xml.instruct!
xml.urlset do
  @entries.each do |entry|
    xml.url do
      xml.loc(social_share_entry_url(entry))
      xml.lastmod(entry.published_at.xmlschema)
    end
  end
end
