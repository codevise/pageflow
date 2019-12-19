ENV['RAILS_ENV'] ||= 'test'
ENV['PAGEFLOW_PLUGIN_ENGINE'] = 'pageflow_paged'

require 'pageflow/support'
Pageflow::Dummy.setup

require 'rspec/rails'

Dir[File.join(File.dirname(__FILE__), 'support/config/**/*.rb')].each do |file|
  require(file)
end

require 'pageflow_paged'

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = '.rspec_status'

  # Disable RSpec exposing methods globally on `Module` and `main`
  config.disable_monkey_patching!

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end
