atom_feed do |feed|
  feed.title @account.name
  feed.url pretty_theming_url(@theming)
  feed.updated @entries.first.updated_at if @entries.present?
  feed.favicon image_path("pageflow/themes/#{@theming.theme.directory_name}/favicon.ico")

  # we can have next_url once we can upgrade ActiveAdmin->Kaminari
  # feed.next_url pretty_theming_url(path_to_next_page(@entries))

  @entries.each do |pageflow_entry|
    published_entry = Pageflow::PublishedEntry.new(pageflow_entry)

    feed.entry(pageflow_entry,
      published: published_entry.published_at,
      updated: pageflow_entry.edited_at) do |entry|

        entry.title published_entry.title
        entry.url entry_url(pageflow_entry)
        entry.rights published_entry.credits, type: "text"
        entry.content social_share_entry_description(published_entry),
          type: 'text', "xml:lang" => published_entry.locale

        entry.author do |author|
          author.name published_entry.author
        end

        social_share_image_urls(published_entry).each do |image_url|
          entry.image published_entry.thumbnail_url if published_entry.thumbnail_file
        end
    end
  end
end
