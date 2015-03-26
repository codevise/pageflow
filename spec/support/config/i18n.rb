RSpec.configure do |config|
  config.before(:each) do
    I18n.locale = I18n.default_locale
  end
end
