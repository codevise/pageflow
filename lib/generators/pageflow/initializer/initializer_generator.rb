require 'rails/generators'

module Pageflow
  module Generators
    class InitializerGenerator < Rails::Generators::Base
      desc 'Install the pageflow initializer.'

      source_root File.expand_path('templates', __dir__)

      def create_initializer
        template 'pageflow.rb', 'config/initializers/pageflow.rb'
      end
    end
  end
end
