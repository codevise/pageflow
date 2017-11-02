module Pageflow
  class FileUsage < ApplicationRecord
    include SerializedConfiguration

    belongs_to :revision
    belongs_to :file, polymorphic: true

    def copy_to(revision)
      revision.file_usages << dup
    end
  end
end
