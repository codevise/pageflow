module PageflowScrolled
  module Generators
    # @api private
    class InstallGenerator < Rails::Generators::Base
      CUSTOM_THEME_ICONS = [:information, :muted, :share, :unmuted].freeze

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
        @custom_theme_icons = CUSTOM_THEME_ICONS.inspect

        # Ruby files in the lib directory are eager loaded in
        # production. This includes template files in
        # lib/generators. Template file extension (.tt) is removed by
        # Thor automatically and ensures the file is not picked up by
        # eager loading.
        template 'themes_plugin.rb.tt', 'app/plugins/scrolled_themes_plugin.rb'
      end

      def install_packages
        if defined?(Shakapacker)
          run 'yarn add css-loader style-loader' \
              ' mini-css-extract-plugin css-minimizer-webpack-plugin' \
              ' postcss postcss-preset-env postcss-loader' \
              ' postcss-import postcss-url postcss-flexbugs-fixes' \
              ' @fontsource/source-sans-pro'
        else
          run 'yarn add postcss-url@^8.0.0 @fontsource/source-sans-pro'
        end
      end

      def webpack_config
        return unless defined?(Shakapacker)

        gsub_file(
          'config/webpack/webpack.config.js',
          "const { generateWebpackConfig } = require('shakapacker')",
          "const { generateWebpackConfig, merge, mergeWithRules } = require('shakapacker')"
        )

        gsub_file(
          'config/webpack/webpack.config.js',
          'const webpackConfig = generateWebpackConfig()',
          <<~JS
            const webpackConfig = merge(
              generateWebpackConfig({
                resolve: {
                  extensions: ['.css']
                }
              }),
              require('pageflow/config/webpack5'),
              require('pageflow-scrolled/config/webpack')
            )
          JS
        )

        gsub_file(
          'config/webpack/webpack.config.js',
          'module.exports = webpackConfig',
          <<~JS
            // Extend file rule to include mp3 extension
            module.exports = mergeWithRules({
              module: {
                rules: {
                  test: 'replace',
                  type: 'match'
                },
              },
            })(webpackConfig, {
              module: {
                rules: [
                  {
                    test: /\.(bmp|gif|jpe?g|png|tiff|ico|avif|webp|eot|otf|ttf|woff|woff2|svg|mp3)$/,
                    type: 'asset/resource'
                  }
                ]
              }
            })
          JS
        )
      end

      def webpack_environment
        return if defined?(Shakapacker)

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
        return if defined?(Shakapacker)

        gsub_file('config/webpacker.yml',
                  'extract_css: false',
                  'extract_css: true')

        inject_into_file('config/webpacker.yml',
                         after: "- .woff2\n") do
          "    - .mp3\n    - .webmanifest\n    - .xml\n"
        end
      end

      def postcss_config
        if defined?(Shakapacker)
          create_file 'postcss.config.js', <<~JS
            module.exports = {
              plugins: [
                require('postcss-import'),
                // Make relative urls in fontsource packages work
                require('postcss-url')({url: 'rebase'}),
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009'
                  },
                  stage: 3
                })
              ]
            }
          JS
        else
          inject_into_file('postcss.config.js',
                           after: "require('postcss-import'),\n") do
            "    // Make relative urls in fontsource packages work\n" \
            "    require('postcss-url')({url: 'rebase'}),\n"
          end
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
          import 'pageflow-scrolled/widgets/defaultNavigation';
          import 'pageflow-scrolled/widgets/consentBar';
        JS
      end

      def default_navigation_widget_packs
        widget_dir = 'app/javascript/packs/pageflow-scrolled/widgets'

        create_file File.join(widget_dir, 'defaultNavigation.js'), <<-JS
          import 'pageflow-scrolled/widgets/defaultNavigation';
          import 'pageflow-scrolled/widgets/defaultNavigation.css';
        JS
      end

      def consent_bar_widget_packs
        widget_dir = 'app/javascript/packs/pageflow-scrolled/widgets'

        create_file File.join(widget_dir, 'consentBar.js'), <<-JS
          import 'pageflow-scrolled/widgets/consentBar';
          import 'pageflow-scrolled/widgets/consentBar.css';
        JS
      end

      def default_font_pack
        create_file 'app/javascript/packs/fonts/sourceSansPro.css', <<-CSS
          @import "@fontsource/source-sans-pro/400.css";
          @import "@fontsource/source-sans-pro/700.css";
        CSS
      end

      def default_theme
        theme_dir = 'app/javascript/pageflow-scrolled/themes/default'
        icons_src_dir = PageflowScrolled::Engine.root.join('package/src/frontend/icons')

        directory 'theme', theme_dir

        CUSTOM_THEME_ICONS.each do |icon|
          copy_file icons_src_dir.join("#{icon}.svg"),
                    File.join(theme_dir, "icons/#{icon}.svg")
        end
      end
    end
  end
end
