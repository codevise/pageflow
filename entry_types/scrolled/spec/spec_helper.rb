ENV['RAILS_ENV'] ||= 'test'
ENV['PAGEFLOW_PLUGIN_ENGINE'] = 'pageflow_scrolled'
ENV['PAGEFLOW_INSTALL_SHAKAPACKER'] = 'true'

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
  config.file_fixture_path = './spec/fixtures'

  # Disable RSpec exposing methods globally on `Module` and `main`
  config.disable_monkey_patching!

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end

  # Inspired by https://gitlab.com/gitlab-org/gitlab-foss
  config.around(:each, :use_clean_rails_memory_store_fragment_caching) do |example|
    begin
      caching_store = ActionController::Base.cache_store
      ActionController::Base.cache_store = ActiveSupport::Cache::MemoryStore.new
      ActionController::Base.perform_caching = true

      example.run
    ensure
      ActionController::Base.perform_caching = false
      ActionController::Base.cache_store = caching_store
    end
  end
end
