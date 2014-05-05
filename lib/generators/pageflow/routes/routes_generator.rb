module Pageflow
  module Generators
    class RoutesGenerator < Rails::Generators::Base
      desc "Injects the pageflow mount call into config/routes.rb"

      def add_route
        inject_into_file 'config/routes.rb', after: "  ActiveAdmin.routes(self)\n" do
          "  Pageflow.routes(self)\n"
        end
      end
    end
  end
end
