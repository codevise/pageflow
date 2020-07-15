ENV['RAILS_ENV'] ||= 'test'
ENV['PAGEFLOW_PLUGIN_ENGINE'] = 'pageflow_scrolled'

require 'pageflow/support'
Pageflow::Dummy.setup

require 'rspec/rails'
require 'rspec/collection_matchers'
require 'rspec/json_expectations'

Dir[File.join(File.dirname(__FILE__), 'support/{config,helpers}/**/*.rb')].each do |file|
  require(file)
end

require 'pageflow/support/config/capybara'
require 'pageflow/support/config/paperclip'
require 'pageflow/support/config/webmock'
require 'pageflow_scrolled'

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = '.rspec_status'

  # Disable RSpec exposing methods globally on `Module` and `main`
  config.disable_monkey_patching!

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end
