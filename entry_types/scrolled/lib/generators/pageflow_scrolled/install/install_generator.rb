module PageflowScrolled
  module Generators
    # @api private
    class InstallGenerator < Rails::Generators::Base
      desc 'Installs Pageflow Scrolled entry type.'

      source_root File.expand_path('templates', __dir__)

      def initializer
        inject_into_file('config/initializers/pageflow.rb',
                         after: "Pageflow.configure do |config|\n") do
          "  config.plugin(PageflowScrolled.plugin)\n\n" \
          "  config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|\n" \
          "    entry_type_config.plugin(ScrolledThemesPlugin.new)\n" \
          "  end\n\n"
        end
      end

      def theme_plugin
        # Ruby files in the lib directory are eager loaded in
        # production. This includes template files in
        # lib/generators. Template file extension (.tt) is removed by
        # Thor automatically and ensures the file is not picked up by
        # eager loading.
        template 'themes_plugin.rb.tt', 'app/plugins/scrolled_themes_plugin.rb'
      end

      def install_packages
        run 'yarn add postcss-url@^8.0.0 @fontsource/source-sans-pro'
      end

      def webpack_environment
        inject_into_file('config/webpack/environment.js',
                         before: "module.exports = environment\n") do
          "environment.config.merge(require('pageflow/config/webpack'))\n" \
          "environment.config.merge(require('pageflow-scrolled/config/webpack'))\n\n" \
          "// Allow loading only chunks of used widgets. runtimeChunk 'single'\n" \
          "// ensures that modules are only evaluated once which is important\n" \
          "// for modules with side effects.\n" \
          "environment.splitChunks((config) =>\n" \
          "  Object.assign({}, config, { optimization: { runtimeChunk: 'single' }})\n" \
          ")\n\n" \
          "// Opt into future default behavior of Webpacker [1] to work around\n" \
          "// problems with Video.js DASH service worker.\n" \
          "//\n" \
          "// [1] https://github.com/rails/webpacker/pull/2624\n" \
          "environment.loaders.delete('nodeModules')\n\n"
        end
      end

      def webpacker_yml
        gsub_file('config/webpacker.yml',
                  'extract_css: false',
                  'extract_css: true')

        inject_into_file('config/webpacker.yml',
                         after: "- .woff2\n") do
          "    - .mp3\n    - .webmanifest\n    - .xml\n"
        end
      end

      def postcss_config
        inject_into_file('postcss.config.js',
                         after: "require('postcss-import'),\n") do
          "    // Make relative urls in fontsource packages work\n" \
          "    require('postcss-url')({url: 'rebase'}),\n"
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
          import 'pageflow-scrolled/frontend/index.css';
          import 'pageflow-scrolled/contentElements-frontend.css';

          import 'pageflow-scrolled/frontend';
          import 'pageflow-scrolled/contentElements-frontend';

          require.context('../pageflow-scrolled/themes', true);
        JS
      end

      def server_pack
        create_file 'app/javascript/packs/pageflow-scrolled-server.js', <<-JS
          import 'pageflow-scrolled/frontend-server';
          import 'pageflow-scrolled/contentElements-frontend';
        JS
      end

      def default_font_pack
        create_file 'app/javascript/packs/fonts/sourceSansPro.css', <<-CSS
          @import "@fontsource/source-sans-pro/400.css";
          @import "@fontsource/source-sans-pro/700.css";
        CSS
      end

      def default_theme
        directory 'theme', 'app/javascript/pageflow-scrolled/themes/default'
      end
    end
  end
end
