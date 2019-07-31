module Pageflow
  module RevisionFileHelper
    # Instead of finding a file directly by its ID (stored in configuration hashes for example),
    # finds the file by its usages perma_id within the scope of the revisions usages.
    # The @entry instance variable (of type DraftEntry or PublishedEntry)
    # must always be available in views using this helper, otherwise an exception is raised.
    #
    # When testing helpers which use the RevisionFileHelper to find their respective files,
    # you can use the UsedfileTestHelper to create the file. This will set the @entry-variable
    # and create a file usage for the file:
    #
    #     image_file = create_used_file(:image_file)
    #
    # This simplifies spec setup by eliminating the need to set up the entry and usages first.
    # If you need to setup the entry explicitely, you can optionally pass it to the helper like so:
    #
    #     entry = PublishedEntry.new(create(:entry, :published))
    #     image_file = create_used_file(:image_file, entry: entry)
    #
    # @since 15.0
    # @returns UsedFile
    def find_file_in_entry(file_type, file_perma_id)
      raise 'No entry of type PublishedEntry or DraftEntry set.' unless @entry.present?
      @entry.find_file_by_perma_id(file_type, file_perma_id)
    end
  end
end
