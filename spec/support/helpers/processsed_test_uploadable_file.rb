module Pageflow
  class ProcessedTestUploadableFile < ActiveRecord::Base
    self.table_name = :test_uploadable_files
    include UploadableFile

    processing_state_machine do
      event :process do
        transition any => 'processing'
      end
    end
  end
end
