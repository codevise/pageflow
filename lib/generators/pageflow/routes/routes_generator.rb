require 'rails/generators'

module Pageflow
  module Generators
    class RoutesGenerator < Rails::Generators::Base
      desc "Injects the pageflow mount call into config/routes.rb"

      def add_route
        inject_into_file 'config/routes.rb', after: "  ActiveAdmin.routes(self)\n" do
          <<-HEREDOC
  Pageflow.routes(self)

  authenticate :user, lambda { |user| user.admin? } do
    mount Resque::Server.new, at: "/background_jobs"
  end
          HEREDOC
        end
      end

      def require_resque_server
        prepend_to_file 'config/routes.rb', "require 'resque/server'\nrequire 'resque/scheduler/server'\n\n"
      end
    end
  end
end
