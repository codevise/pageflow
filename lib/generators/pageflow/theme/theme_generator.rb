require 'rails/generators'

module Pageflow
  module Generators
    class ThemeGenerator < Rails::Generators::Base
      desc 'Creates a configurable theme based on the default theme.'

      argument :name,
               required: false,
               default: 'custom',
               desc: 'The name of the new theme'

      source_root File.expand_path('templates', __dir__)

      def copy_template
        directory('themes', File.join('app', 'assets', 'stylesheets', 'pageflow', 'themes'))
        empty_directory(File.join('app', 'assets', 'images', 'pageflow', 'themes', name))
        copy_file('preview.png', "app/assets/images/pageflow/themes/#{name}/preview.png")
        copy_file('preview_thumbnail.png',
                  "app/assets/images/pageflow/themes/#{name}/preview_thumbnail.png")
      end
    end
  end
end
