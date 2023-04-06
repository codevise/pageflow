atom_feed language: @feed.locale,
          root_url: @feed.root_url,
          url: @feed.custom_url do |feed|
  feed.title(@feed.title)
  feed.updated(@feed.updated_at&.utc)

  @feed.entries.each do |entry|
    feed.entry(entry,
               url: social_share_entry_url(entry),
               published: entry.first_published_at.utc,
               updated: entry.published_at.utc) do |feed_entry|
      feed_entry.title(entry.title)
      feed_entry.content(feed_entry_content(entry), type: 'html')

      feed_entry.author do |author|
        author.name(entry.author)
      end
    end
  end
end
