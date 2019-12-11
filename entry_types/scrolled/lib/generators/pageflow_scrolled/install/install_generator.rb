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

      def editor_pack
        create_file 'app/javascript/packs/pageflow-scrolled-editor.js', <<-JS
          import 'pageflow-scrolled/editor';
        JS
      end
    end
  end
end
