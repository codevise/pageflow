require 'rails/generators'

module Pageflow
  module Generators
    class ErrorPagesGenerator < Rails::Generators::Base
      desc 'Generate error pages.'

      source_root File.expand_path('templates', __dir__)

      def create_not_found
        copy_file '404.html', 'public/pageflow/error_pages/404.html'
      end

      def copy_fonts
        directory 'fonts', 'public/pageflow/error_pages/fonts'
      end

      def copy_stylesheets
        directory 'stylesheets', 'public/pageflow/error_pages/stylesheets'
      end

      def copy_images
        directory 'images', 'public/pageflow/error_pages/images'
      end
    end
  end
end
