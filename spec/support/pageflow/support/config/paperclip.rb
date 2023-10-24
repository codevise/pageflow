RSpec.configure do |config|
  config.before(:all) do
    Dir.glob(Rails.root.join('public', 'system', 's3', '*')).each do |f|
      FileUtils.rm_r(f)
    end
  end

  config.after(:each, unstub_paperclip: true) do
    Dir.glob(Rails.root.join('public', 'system', 's3', '*')).each do |f|
      FileUtils.rm_r(f)
    end
  end

  config.before(:each) do |example|
    unless example.metadata[:unstub_paperclip] || example.metadata[:js]
      allow_any_instance_of(Paperclip::Attachment).to receive(:post_process_styles)
      allow(Paperclip).to receive(:run).and_return('100x100')
    end
  end
end

module Paperclip
  class Attachment
    def bucket_name
      'test'
    end
  end
end
