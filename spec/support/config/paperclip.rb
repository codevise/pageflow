Paperclip.interpolates(:host) do
  'test-host'
end

module Paperclip
  class Attachment
    def bucket_name
      'test'
    end
  end
end

RSpec.configure do |config|
  config.before(:all) do
    pageflow_configure do |pageflow_config|
      pageflow_config.paperclip_s3_default_options.merge!(
        storage: :filesystem,
        path: ':rails_root/tmp/attachments/test/s3/:class/:attachment/:id_partition/:style/:filename'
      )
    end
  end

  config.before(:each) do
    Dir.glob(Rails.root.join('tmp', 'attachments', 'test', '*')).each do |f|
      FileUtils.rm_r(f)
    end
  end

  config.before(:each, stub_paperclip: true) do
    allow_any_instance_of(Paperclip::Attachment).to receive(:post_process)
    allow(Paperclip).to receive(:run).and_return('100x100')
  end
end
