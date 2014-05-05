require 'webmock/rspec'

RSpec.configure do |config|
  config.before(:each) do
    WebMock.disable_net_connect!(:allow_localhost => true)
  end

  config.before(:each, :integration => true) do
    WebMock.allow_net_connect!
  end
end
