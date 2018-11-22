module Pageflow
  class TestHostedFile < ActiveRecord::Base
    self.table_name = :test_hosted_files
    include HostedFile

    has_attached_file(:attachment_on_s3,
                      Pageflow.config.paperclip_s3_default_options)
  end
end
