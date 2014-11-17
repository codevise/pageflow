require 'timecop'

RSpec.configure do |config|
  config.before(:each) do
    Timecop.freeze(Time.local(2013))
  end

  config.before(:each, :capybara_feature => true) do
    # Do not freeze time in capybara tests to enable waiting for elements
    Timecop.travel(Time.local(2013))
  end

  config.before(:each, :integration => true) do
    # Do not freeze time in integration tests
    Timecop.return
  end

  config.after(:each) do
    Timecop.return
  end
end
