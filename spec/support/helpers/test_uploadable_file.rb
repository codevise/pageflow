module Pageflow
  class TestUploadableFile < ActiveRecord::Base
    self.table_name = :test_uploadable_files
    include UploadableFile
  end
end
