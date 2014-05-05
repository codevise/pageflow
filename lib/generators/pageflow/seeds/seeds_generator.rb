module Pageflow
  module Generators
    class SeedsGenerator < Rails::Generators::Base
      desc "Requires the pageflow seeds in db/seeds.rb"

      def add_route
        append_to_file 'db/seeds.rb' do
          "require 'pageflow/seeds'\n"
        end
      end
    end
  end
end
