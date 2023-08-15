require 'webmock/rspec'

RSpec.configure do |config|
  config.before(:each) do
    WebMock.disable_net_connect!(
      allow_localhost: true,
      allow: [
        'https://googlechromelabs.github.io',
        'https://edgedl.me.gvt1.com'
      ]
    )
  end
end
