module Pageflow
  module Generators
    class CancanGenerator < Rails::Generators::Base
      desc "Configure active admin to use cancan and setup ability."

      source_root File.expand_path("../templates", __FILE__)

      def configure_active_admin
        inject_into_file 'config/initializers/active_admin.rb', after: "  config.authentication_method = :authenticate_user!\n" do
          "  config.authorization_adapter = ActiveAdmin::CanCanAdapter\n"
        end
      end

      def create_ability
        template 'ability.rb', 'app/models/ability.rb'
      end
    end
  end
end
