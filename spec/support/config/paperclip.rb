RSpec.configure do |config|
  config.before(:each) do
    Dir.glob(Rails.root.join('public', 'system', 's3', '*')).each do |f|
      FileUtils.rm_r(f)
    end
  end

  config.before(:each, stub_paperclip: true) do
    allow_any_instance_of(Paperclip::Attachment).to receive(:post_process)
    allow(Paperclip).to receive(:run).and_return('100x100')
  end
end

module Paperclip
  class Attachment
    def bucket_name
      'test'
    end
  end
end
