RSpec.configure do |config|
  config.include Devise::Test::ControllerHelpers, type: :controller
  config.include Devise::Test::ControllerHelpers, type: :view_component
  config.include Devise::Test::IntegrationHelpers, type: :request
end
