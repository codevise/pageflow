namespace :pageflow_paged do
  desc 'Generate dummy app for current Rails version.'
  task :dummy do
    require 'pageflow/support'
    Pageflow::Dummy.setup
  end
end
