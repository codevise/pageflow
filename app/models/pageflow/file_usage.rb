module Pageflow
  class FileUsage < ApplicationRecord # rubocop:todo Style/Documentation
    include SerializedConfiguration
    include RevisionComponent

    alias_attribute :perma_id, :file_perma_id

    belongs_to :file, polymorphic: true

    def copy_to(revision)
      revision.file_usages << dup
    end
  end
end
