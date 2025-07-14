require 'rails/generators'
require 'securerandom'

module Pageflow
  module Generators
    class SeedsGenerator < Rails::Generators::Base
      desc 'Requires the pageflow seeds in db/seeds.rb'

      argument :password,
               default: SecureRandom.random_number(36**12).to_s(36).rjust(12, '0'),
               desc: 'Default user password'

      source_root File.expand_path('templates', __dir__)

      def create_initializer
        template 'seeds.rb', 'db/seeds.rb'
      end
    end
  end
end
