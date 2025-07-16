require 'database_cleaner-active_record'

RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
  end

  config.before(:each, js: true) do
    DatabaseCleaner.strategy = :truncation
  end

  config.before(:each, multithread: true) do
    DatabaseCleaner.strategy = :truncation
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    # Resetting sessions is required to wait for pending ajax
    # requests before cleaning the database, but it also re-raises
    # exceptions raised by the server. So we need to make sure not
    # to skip database cleaning.
    Capybara.reset_sessions!
  ensure
    DatabaseCleaner.clean
  end
end
