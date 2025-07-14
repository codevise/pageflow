require 'rails/generators'

module Pageflow
  module Generators
    class CancanGenerator < Rails::Generators::Base
      desc 'Setup ability class.'

      source_root File.expand_path('templates', __dir__)

      def create_ability
        template 'ability.rb', 'app/models/ability.rb'
      end
    end
  end
end
