require 'factory_girl_rails'

RSpec.configure do |config|
  # Allow to use build and create methods without FactoryGirl prefix.
  config.include FactoryGirl::Syntax::Methods

  # Make sure factories are up to date when using spring
  config.before(:all) do
    FactoryGirl.reload
  end
end
