module Pageflow
  module Generators
    class SeedsGenerator < Rails::Generators::Base
      desc "Requires the pageflow seeds in db/seeds.rb"

      source_root File.expand_path("../templates", __FILE__)

      def create_initializer
        template 'seeds.rb', 'db/seeds.rb'
      end
    end
  end
end
