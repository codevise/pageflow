RSpec.configure do |config|
  # Inspired by
  # https://gitlab.com/gitlab-org/gitlab-foss/-/blob/6f5be4b446db2f17fc0307c4fce8ae285b35d89a/spec/support/caching.rb
  config.around(:each, :use_clean_rails_memory_store_fragment_caching) do |example|
    rails_cache = Rails.cache
    controller_cache_store = ActionController::Base.cache_store

    # Also replace Rails.cache for consistency since JBuilder uses
    # it directly to cache fragments instead of going through
    # ActionController::Base.cache_store.
    ActionController::Base.cache_store = Rails.cache = ActiveSupport::Cache::MemoryStore.new
    ActionController::Base.perform_caching = true

    example.run
  ensure
    ActionController::Base.perform_caching = false
    ActionController::Base.cache_store = controller_cache_store
    Rails.cache = rails_cache
  end
end
