atom_feed do |feed|
  feed.title 'Published entry atom feed'
  feed.updated @entries.first.updated_at if @entries.present?

  @entries.each do |pageflow_entry|
    feed.entry(pageflow_entry) do |entry|
      entry.title(pageflow_entry.title)
    end
  end
end
