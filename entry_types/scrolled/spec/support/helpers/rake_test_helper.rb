require 'rake'

module RakeTestHelper
  def rake(task, *)
    Rake.application.tasks.each(&:reenable)
    Rake.application[task].invoke(*)
  end
end

RSpec.configure do |config|
  config.include(RakeTestHelper)
end
