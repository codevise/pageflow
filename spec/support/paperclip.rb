RSpec.configure do |config|
  config.before(:each) do
    Dir.glob(Rails.root.join('tmp', 'attachments', 'test', '*')).each do |f|
      FileUtils.rm_r(f)
    end
  end
end
