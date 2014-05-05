module Pageflow
  module Generators
    class AssetsGenerator < Rails::Generators::Base
      desc "Install the pageflow assets."

      source_root File.expand_path("../templates", __FILE__)

      def create_assets
        template 'editor.js', 'app/assets/javascripts/pageflow/editor.js'
        template 'editor.css.scss', 'app/assets/stylesheets/pageflow/editor.css.scss'

        template 'application.js', 'app/assets/javascripts/pageflow/application.js'
        template 'application.css.scss', 'app/assets/stylesheets/pageflow/application.css.scss'

        append_to_file 'app/assets/javascripts/active_admin.js.coffee' do
          "#= require pageflow/admin\n"
        end

        append_to_file 'app/assets/stylesheets/active_admin.css.scss' do
          "@import \"pageflow/admin\";\n"
        end
      end
    end
  end
end
