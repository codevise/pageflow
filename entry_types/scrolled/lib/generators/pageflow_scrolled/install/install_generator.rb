module PageflowScrolled
  module Generators
    # @api private
    class InstallGenerator < Rails::Generators::Base
      desc 'Installs Pageflow Scrolled entry type.'

      def install_webpacker
        require 'webpacker'
        gemfile = File.expand_path('../../../../../../Gemfile', __dir__)
        rake "webpacker:install BUNDLE_GEMFILE=#{gemfile}"
      end

      def webpack_environment
        inject_into_file('config/webpack/environment.js',
                         before: "module.exports = environment\n") do
          "const pageflowConfig = require('pageflow/config/webpack')\n" \
          "environment.config.merge(pageflowConfig)\n\n"
        end
      end

      def editor_pack
        create_file 'app/javascript/packs/pageflow-scrolled-editor.js', <<-JS
          import 'pageflow-scrolled/editor';
          import 'pageflow-scrolled/contentElements-editor';
          import 'pageflow-scrolled/contentElements-frontend';
        JS
      end

      def frontend_pack
        create_file 'app/javascript/packs/pageflow-scrolled-frontend.js', <<-JS
          import 'pageflow-scrolled/frontend';
          import 'pageflow-scrolled/contentElements-frontend';
        JS
      end
    end
  end
end
