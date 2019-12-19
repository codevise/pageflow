require 'rails/generators'

module Pageflow
  module Generators
    class ActiveAdminInitializerGenerator < Rails::Generators::Base
      desc "Configure active admin utilitiy menu to contain profile link."

      def configure_active_admin_load_path
        prepend_to_file 'config/initializers/active_admin.rb' do
          "ActiveAdmin.application.load_paths += [Pageflow.active_admin_load_path]\n\n"
        end
      end

      def configure_active_admin
        inject_into_file 'config/initializers/active_admin.rb', after: "ActiveAdmin.setup do |config|\n" do
          <<-RUBY
  Pageflow.active_admin_settings(config)

  config.namespace :admin do |admin|
    # Place a user user profile button next to the sign out link.
    admin.build_menu :utility_navigation do |menu|
      menu.add(:label => proc { display_name current_active_admin_user },
               :id => 'current_user',
               :if => proc { current_active_admin_user? },
               :url => '/admin/users/me')
      admin.add_logout_button_to_menu(menu)
    end
  end
RUBY
        end
      end

      def use_devise
        gsub_file('config/initializers/active_admin.rb',
                  '# config.current_user_method =',
                  'config.current_user_method =')

        gsub_file('config/initializers/active_admin.rb',
                  '# config.authentication_method =',
                  'config.authentication_method =')
      end

      def use_can_can
        gsub_file('config/initializers/active_admin.rb',
                  '# config.authorization_adapter =',
                  'config.authorization_adapter =')
      end
    end
  end
end
