require 'factory_bot_rails'

RSpec.configure do |config|
  # Allow to use build and create methods without FactoryBot prefix.
  config.include FactoryBot::Syntax::Methods

  # Make sure factories are up to date when using spring. Skip in CI
  # since reloading causes factories to be excluded in test coverage.
  unless ENV['CI']
    config.before(:all) do
      FactoryBot.reload
    end
  end
end
