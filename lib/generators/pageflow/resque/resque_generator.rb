require 'rails/generators'

module Pageflow
  module Generators
    class ResqueGenerator < Rails::Generators::Base
      desc "Configure resque for pageflow."

      source_root File.expand_path("../templates", __FILE__)

      def create_initializers
        template 'resque.rb', 'config/initializers/resque.rb'
        template 'resque_enqueue_after_commit_patch.rb', 'config/initializers/resque_enqueue_after_commit_patch.rb'
        template 'resque.rake', 'lib/tasks/resque.rake'

        inject_into_file 'config/application.rb', after: "config.load_defaults 5.2\n" do
          <<-RUBY
    config.active_job.queue_adapter = :resque
RUBY
        end
      end
    end
  end
end
