module Pageflow
  class TestGeneratedFile < ActiveRecord::Base
    self.table_name = :test_generated_files
    include ReusableFile

    def retryable?
      false
    end

    def ready?
      true
    end

    def failed?
      false
    end

    def publish!; end

    def url
      read_attribute(:url)
    end

    def original_url
      url
    end
  end
end
