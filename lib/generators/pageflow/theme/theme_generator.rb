module Pageflow
  module Generators
    class ThemeGenerator < Rails::Generators::Base
      desc 'Copies a theme template to the app.'

      argument :name, required: false, default: 'custom',
               desc: 'The scope to copy views to'

      source_root File.expand_path("../../../../../app/assets", __FILE__)

      def copy_template
        directory('stylesheets/pageflow/themes/default', themes_path('stylesheets', name))
        directory('images/pageflow/themes/default', themes_path('images', name))

        template('stylesheets/pageflow/themes/default.css.scss', themes_path('stylesheets', "#{name}.css.scss")) do |content|
          content.gsub!('$theme-name: "default";', %Q'$theme-name: "#{name}";')
          content.gsub!('@import "./default/', %Q'@import "./#{name}/')
        end
      end

      private

      def themes_path(type, path)
        File.join('app', 'assets', type, 'pageflow', 'themes', path)
      end
    end
  end
end
