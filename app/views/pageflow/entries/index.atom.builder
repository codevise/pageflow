atom_feed do |feed|
  feed.title @account.name
  feed.url pretty_theming_url(@theming)
  feed.updated @entries.first.updated_at if @entries.present?
  feed.next_url pretty_theming_url(path_to_next_page(@entries))
  feed.favicon(image_path("pageflow/themes/#{@theming.theme.directory_name}/favicon.ico"))

  @entries.each do |pageflow_entry|
    published_entry = Pageflow::PublishedEntry.new(pageflow_entry)

    feed.entry(pageflow_entry) do |entry|
      entry.url entry_url(pageflow_entry)
      entry.title(pageflow_entry.title)
      entry.content_text(pageflow_entry.summary)
      entry.image(published_entry.thumbnail_url) if published_entry.thumbnail_file
      entry.tag! "xml:lang", pageflow_entry.language

      entry.author do |author|
        author.name(pageflow_entry.author)
      end
    end
  end
end
