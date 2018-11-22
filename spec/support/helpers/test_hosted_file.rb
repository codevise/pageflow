module Pageflow
  class TestHostedFile < ActiveRecord::Base
    self.table_name = :test_hosted_files
    include HostedFile
  end
end
