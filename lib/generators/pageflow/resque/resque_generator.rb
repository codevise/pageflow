module Pageflow
  module Generators
    class ResqueGenerator < Rails::Generators::Base
      desc "Configure resque for pageflow."

      source_root File.expand_path("../templates", __FILE__)

      def create_initializers
        template 'resque.rb', 'config/initializers/resque.rb'
        template 'resque_mailer.rb', 'config/initializers/resque_mailer.rb'
        template 'resque_logger.rb', 'config/initializers/resque_logger.rb'
        template 'resque_enqueue_after_commit_patch.rb', 'config/initializers/resque_enqueue_after_commit_patch.rb'
        template 'devise_async.rb', 'config/initializers/devise_async.rb'
        template 'resque.rake', 'lib/tasks/resque.rake'
      end
    end
  end
end
