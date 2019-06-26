module Pageflow
  module RevisionFileHelper
    # Instead of finding a file directly by its ID (stored in configuration hashes for example),
    # finds the file within the scope of the revisions usages.
    # The @entry instance variable (of type DraftEntry or PublishedEntry)
    # must always be available in views using this helper, otherwise an exception is raised.
    #
    # When testing helpers which use the RevisionFileHelper to find their respective files,
    # you can stub its functionality by including the shared context
    # "usage agnostic file association" and specifying `entry_has_file` for the file:
    #
    #     image_file = create(:image_file)
    #     entry_has_file(image_file)
    #
    # This simplifies spec setup by eliminating the need to set up the entry and usages first.
    #
    # @since edge
    # @returns UsedFile
    def find_file_in_entry(file_type, file_id)
      raise 'No entry of type PublishedEntry or DraftEntry set.' unless @entry.present?
      @entry.find_file_by_id(file_type, file_id)
    end
  end
end
