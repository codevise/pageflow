module UsedFileTestHelper
  # creates a file with usage in entry
  # and sets the magic @entry-variable (always present in views) for file lookup
  def create_used_file(model, entry: nil, **attributes)
    file = create(model, attributes)
    @entry = entry || Pageflow::PublishedEntry.new(create(:entry, :published))
    usage = file.usages.create(revision: @entry.revision)
    Pageflow::UsedFile.new(file, usage)
  end
end