Pageflow.configure do |config|
  config.features.enable_by_default('scrolled_entry_type')
end

Rails.application.reload_routes!
