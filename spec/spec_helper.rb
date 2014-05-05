ENV['RAILS_ENV'] ||= 'test'

require File.expand_path("../dummy/config/environment.rb",  __FILE__)
require 'rspec/rails'
require 'domino'

Dir[File.join(File.dirname(__FILE__), 'support/**/*.rb')].each { |file| require(file) }
Dir[Pageflow::Engine.root.join("spec/**/*_examples.rb")].each { |file| require(file) }

RSpec.configure do |config|
  # Use DatabaseCleaner to handle transactions.
  # See ./support/database_cleaner.rb
  config.use_transactional_fixtures = false

  config.infer_base_class_for_anonymous_controllers = false
  config.order = "random"
end
