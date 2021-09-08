module UsedFileTestHelper
  # creates a file with usage in entry
  # and sets the magic @entry-variable (always present in views) for file lookup
  def create_used_file(model, *traits, entry: nil, **attributes)
    file = create(model, *traits, attributes)
    @entry = entry || Pageflow::PublishedEntry.new(create(:entry, :published))
    usage = file.usages.create(revision: @entry.revision)
    Pageflow::UsedFile.new(file, usage)
  end
end
