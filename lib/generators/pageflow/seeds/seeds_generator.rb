require 'rails/generators'
require 'securerandom'

module Pageflow
  module Generators
    class SeedsGenerator < Rails::Generators::Base
      desc "Requires the pageflow seeds in db/seeds.rb"

      source_root File.expand_path("../templates", __FILE__)

      def create_initializer
        template 'seeds.rb', 'db/seeds.rb'
      end

      def generate_random_password
        password = SecureRandom.random_number(36**12).to_s(36).rjust(12, "0")
        gsub_file('db/seeds.rb',
                  '!Pass123',
                  password)
      end
    end
  end
end
