require 'capybara/rspec'
require 'selenium-webdriver'
require 'capybara/chromedriver/logger'

Capybara.register_driver :selenium_chrome_headless_no_sandbox do |app|
  browser_options = ::Selenium::WebDriver::Chrome::Options.new
  browser_options.args << '--headless'
  browser_options.args << '--disable-gpu'
  # Required for chrome to work in container based Travis environment
  # (see https://docs.travis-ci.com/user/chrome)
  browser_options.args << '--no-sandbox'
  Capybara::Selenium::Driver.new(app, browser: :chrome, options: browser_options)
end

Capybara.javascript_driver = :selenium_chrome_headless_no_sandbox

Capybara::Chromedriver::Logger.raise_js_errors = true
Capybara::Chromedriver::Logger.filters = [
  # Bandwidth probe files are not available in tests
  /bandwidth_probe.*Failed to load resource/i,

  # React does not like the server rendered "back to top" link inside
  # page sections.
  /Target node has markup rendered by React/i,

  # Ignore failure of debounced request to save order of storylines
  %r{storylines/order - Failed to load resource: the server responded with a status of 401},

  # Ignore failure of debounced request to refresh partials while db
  # has already been cleaned
  /partials - Failed to load resource: the server responded with a status of 401/
]

RSpec.configure do |config|
  config.after :each, js: true do
    Capybara::Chromedriver::Logger::TestHooks.after_example!
  end
end
