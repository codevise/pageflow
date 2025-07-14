module PageflowScrolled
  # @api private
  module ReactServerSideRenderingHelper
    include Pageflow::RenderJsonHelper
    include PageflowScrolled::EntryJsonSeedHelper

    def render_scrolled_entry(entry)
      seed_json = render_json do |json|
        scrolled_entry_json_seed(json, entry)
      end

      ReactServerSideRenderingHelper.renderer.render('Root', "{seed: #{seed_json}}", {})
    end

    def self.renderer
      if Rails.env.development?
        ReactServerSideRenderingHelper.new_renderer
      else
        @renderer ||= ReactServerSideRenderingHelper.new_renderer
      end
    end

    # Normally react-rails either tries to auto detect which asset
    # container (i.e. Webpack, Sprockets) to use or relies on an app
    # wide configuration. Specify it explicitly to decouple Pageflow
    # Scrolled from host application configuration.
    class ReactRenderer < ::React::ServerRendering::BundleRenderer
      def asset_container_class
        WebpackerSplitChunksManifestContainer
      end
    end

    # see https://github.com/reactjs/react-rails/issues/970#issuecomment-476338244
    class WebpackerSplitChunksManifestContainer < React::ServerRendering::WebpackerManifestContainer
      CLIENT_EXEC =
        %r{__webpack_exec__\("./node_modules/webpack-dev-server/client/index\.js[^"]*"\),}

      def find_asset(logical_path)
        asset_paths = manifest.lookup_pack_with_chunks(logical_path, type: :javascript)

        asset_contents =
          if Webpacker.dev_server.running?
            ds = Webpacker.dev_server
            asset_paths.map do |asset_path|
              # Remove the protocol and host from the asset
              # path. Sometimes webpacker includes this, sometimes
              # it does not
              asset_path.slice!("#{ds.protocol}://#{ds.host_with_port}")
              dev_server_asset =
                URI.open("#{ds.protocol}://#{ds.host_with_port}#{asset_path}").read

              # Remove webpack-dev-server client code that tries to
              # interact with browser globals:
              dev_server_asset.sub!(CLIENT_REQUIRE, '//\0') # for Webpack 4
              dev_server_asset.sub!(CLIENT_EXEC, '/*\0*/')  # for Webpack 5

              dev_server_asset
            end
          else
            asset_paths.map do |asset_path|
              full_path = ::Rails.root.join('public', asset_path[1..-1])
              File.read(full_path)
            end
          end

        asset_contents.join("\n")
      end
    end

    def self.new_renderer
      ReactRenderer
        .new(files: ['pageflow-scrolled-server'],
             # Define required external globals.
             code: <<-JS)
                #{WebpackPublicPathHelper.js_snippet}
                function videojs() {};
             JS
    end
  end
end
