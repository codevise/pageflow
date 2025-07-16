RSpec.configure do |config|
  config.before(:each) do |example|
    ActiveAdmin::SearchableSelect.inline_ajax_options = (example.metadata[:type] == :feature)
  end
end
