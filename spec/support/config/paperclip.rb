Paperclip.interpolates(:host) do |attachment, style|
  'test-host'
end

class Paperclip::Attachment
  def bucket_name
    'test'
  end
end

Pageflow.configure do |config|
  config.paperclip_s3_default_options.merge!({
    storage: :filesystem,
    path: ':rails_root/tmp/attachments/test/s3/:class/:attachment/:id_partition/:style/:filename'
  })
end

RSpec.configure do |config|
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
