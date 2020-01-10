require 'webmock/rspec'

RSpec.configure do |config|
  config.before(:each) do
    driver_urls = Webdrivers::Common.subclasses.map(&:base_url)
    WebMock.disable_net_connect!(allow_localhost: true, allow: driver_urls)
  end
end
