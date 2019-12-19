require 'pageflow/edit_lock_test_helper'

RSpec.configure do |config|
  config.include Pageflow::EditLockTestHelpers, type: :controller
end
