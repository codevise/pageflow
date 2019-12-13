require 'pageflow/json_test_helper'

RSpec.configure do |config|
  config.include(Pageflow::JsonTestHelper, type: :controller)
  config.include(Pageflow::JsonTestHelper, type: :helper)
end
