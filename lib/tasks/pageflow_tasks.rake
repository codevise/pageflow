namespace :pageflow do
  desc 'Generate dummy app for current Rails version.'
  task :dummy do
    require 'pageflow/support'
    Pageflow::Dummy.setup
  end

  namespace :node_package do
    desc 'Build node package'
    task :build do
      system('bin/npm run build')
    end
  end
end
