RSpec.configure do |config|
  config.include Devise::TestHelpers, type: :controller
  config.include Devise::TestHelpers, type: :view_component

  module DeviseTestHelpersWithScope
    def sign_in(user)
      super(:user, user)
    end
  end

  config.include DeviseTestHelpersWithScope, type: :controller
  config.include DeviseTestHelpersWithScope, type: :view_component
end
