module Pageflow
  module RevisionFileHelper
    def find_file_in_entry(file_type, file_perma_id)
      FileUsage.find_by(revision: @entry, file_type: file_type, file_perma_id: file_perma_id)&.file
    end
  end
end
