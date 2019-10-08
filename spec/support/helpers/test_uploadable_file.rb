module Pageflow
  class TestUploadableFile < ActiveRecord::Base
    self.table_name = :test_uploadable_files
    include UploadableFile

    belongs_to :related_image_file, class_name: 'ImageFile', optional: true
  end
end
