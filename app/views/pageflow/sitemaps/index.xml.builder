xml.instruct!
xml.urlset xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' do
  @entries.each do |entry|
    xml.url do
      xml.loc(social_share_entry_url(entry))
      xml.lastmod(entry.published_at.utc.xmlschema)
    end
  end
end
