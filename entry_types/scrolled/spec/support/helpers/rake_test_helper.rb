require 'rake'

module RakeTestHelper
  def rake(task, *args)
    Rake.application.tasks.each(&:reenable)
    Rake.application[task].invoke(*args)
  end
end

RSpec.configure do |config|
  config.include(RakeTestHelper)
end
