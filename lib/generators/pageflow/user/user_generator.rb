require 'rails/generators'

module Pageflow
  module Generators
    class UserGenerator < Rails::Generators::Base
      desc 'Injects the Pageflow::User mixin into the User class.'

      def include_mixin
        inject_into_file 'app/models/user.rb', before: /end$/ do
          "\n  include Pageflow::UserMixin\n"
        end
      end
    end
  end
end
