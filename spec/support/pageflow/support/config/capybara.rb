require 'capybara/rspec'
require 'selenium-webdriver'
require 'capybara/chromedriver/logger'

Capybara.register_driver :selenium_chrome_headless_no_sandbox do |app|
  options = Selenium::WebDriver::Options.chrome(
    logging_prefs: {browser: 'ALL'}
  )

  options.add_argument('--headless=new')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-gpu') if Gem.win_platform?

  Capybara::Selenium::Driver.new(app,
                                 browser: :chrome,
                                 options:)
end

Capybara.javascript_driver = :selenium_chrome_headless_no_sandbox
Capybara.server = :puma, {Silent: true}

Capybara::Chromedriver::Logger.raise_js_errors = true
Capybara::Chromedriver::Logger.filters = [
  # Bandwidth probe files are not available in tests
  /bandwidth_probe.*Failed to load resource/i,

  # Logged by Pageflow after legacy bandwidth detection
  /Detected bandwidth/,

  # Not helpful in specs
  /Download the React DevTools/,

  # Caused by sign in form
  /Input elements should have autocomplete attributes/,

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
