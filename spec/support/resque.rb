RSpec.configure do |config|
  config.before(:each, :inline_resque => true) do
    Resque.inline = true
  end

  config.after(:each, :inline_resque => true) do
    Resque.inline = false
  end
end
