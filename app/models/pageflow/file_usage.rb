module Pageflow
  class FileUsage < ActiveRecord::Base
    belongs_to :revision
    belongs_to :file, polymorphic: true

    serialize :configuration, JSON

    def configuration
      super || {}
    end

    def copy_to(revision)
      revision.file_usages << dup
    end
  end
end
