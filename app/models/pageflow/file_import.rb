module Pageflow
  # File import reference, belongs to entry and file
  class FileImport < ApplicationRecord
    belongs_to :entry
    belongs_to :file, polymorphic: true

    def file_importer
      Pageflow.config.file_importers.find_by_name!(read_attribute(:file_importer))
    end
  end
end
