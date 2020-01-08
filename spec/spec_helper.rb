ENV['RAILS_ENV'] ||= 'test'

require 'coveralls'
Coveralls.wear!

require 'rails-controller-testing'
require 'rspec/rails'
require 'rspec/collection_matchers'
require 'rspec/json_expectations'
require 'domino'
require 'ammeter/init'
require 'pundit/matchers'

require 'pageflow/test_widget_type'
require 'pageflow/used_file_test_helper'

Dir[File.join(File.dirname(__FILE__), 'support/{config,dominos,helpers,matchers}/**/*.rb')].each { |file| require(file) }
Dir[Pageflow::Engine.root.join("spec/**/*_examples.rb")].each { |file| require(file) }

RSpec.configure do |config|
  # Use DatabaseCleaner to handle transactions.
  # See ./support/database_cleaner.rb
  config.use_transactional_fixtures = false

  config.infer_base_class_for_anonymous_controllers = false
  config.infer_spec_type_from_file_location!

  config.expect_with :rspec do |c|
    c.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.example_status_persistence_file_path = './tmp/rspec_failures'

  config.order = "random"
end
