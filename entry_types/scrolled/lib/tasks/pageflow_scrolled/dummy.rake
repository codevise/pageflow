namespace :pageflow_scrolled do
  desc 'Generate dummy app for current Rails version.'
  task :dummy do
    require 'pageflow/support'
    ENV['PAGEFLOW_INSTALL_SHAKAPACKER'] = 'true'
    Pageflow::Dummy.setup
  end
end
