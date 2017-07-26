module Pageflow
  class FileUsage < ActiveRecord::Base
    include SerializedConfiguration

    belongs_to :revision
    belongs_to :file, polymorphic: true

    def copy_to(revision)
      revision.file_usages << dup
    end
  end
end
