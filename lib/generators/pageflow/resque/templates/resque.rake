require 'resque/tasks'
require 'resque_scheduler/tasks'

namespace :resque do
  # Tell resque to initialize the rails app in worker processes
  task :setup => :environment
end
