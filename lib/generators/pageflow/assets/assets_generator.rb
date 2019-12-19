require 'rails/generators'

module Pageflow
  module Generators
    class AssetsGenerator < Rails::Generators::Base
      desc "Install the pageflow assets."

      source_root File.expand_path("../templates", __FILE__)

      def create_assets
        template 'editor.js', 'app/assets/javascripts/pageflow/editor.js'
        template 'editor.scss', 'app/assets/stylesheets/pageflow/editor.scss'

        template 'application.js', 'app/assets/javascripts/pageflow/application.js'
        template 'application.scss', 'app/assets/stylesheets/pageflow/application.scss'

        template 'components.js', 'app/assets/javascripts/components.js'

        append_to_file 'app/assets/javascripts/active_admin.js' do
          "//= require pageflow/admin\n"
        end

        append_to_file 'app/assets/stylesheets/active_admin.scss' do
          "@import \"pageflow/admin\";\n"
        end
      end

      def initialize_on_precompile
        inject_into_file 'config/application.rb', after: "class Application < Rails::Application\n" do
          "    # required for i18n-js gem\n" +
          "    config.assets.initialize_on_precompile = true\n\n"
        end
      end
    end
  end
end
