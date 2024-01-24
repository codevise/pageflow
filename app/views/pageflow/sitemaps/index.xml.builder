xml.instruct!
xml.urlset xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
           'xmlns:xhtml': 'http://www.w3.org/1999/xhtml' do
  @entries.each do |entry|
    xml.url do
      xml.loc(social_share_entry_url(entry))
      xml.lastmod(entry.published_at.utc.xmlschema)

      entry.translations.each do |translation|
        xml.tag!('xhtml:link',
                 rel: 'alternate',
                 hreflang: translation.locale,
                 href: social_share_entry_url(translation))
      end
    end
  end
end
