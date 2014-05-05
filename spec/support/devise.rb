RSpec.configure do |config|
  config.include Devise::TestHelpers, :type => :controller

  module DeviseTestHelpersWithScope
    def sign_in(user)
      super(:user, user)
    end
  end

  config.include DeviseTestHelpersWithScope, :type => :controller
end
