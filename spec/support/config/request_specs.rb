RSpec.configure do |config|
  config.include Pageflow::Engine.routes.url_helpers, type: :request
end
