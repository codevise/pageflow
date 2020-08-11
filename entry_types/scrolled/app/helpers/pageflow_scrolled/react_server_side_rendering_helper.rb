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
      @renderer ||=
        ReactRenderer
        .new(files: ['pageflow-scrolled-server.js'],
             # Define required external globals.
             code: 'function videojs() {};')
    end

    # Normally react-rails either tries to auto detect which asset
    # container (i.e. Webpack, Sprockets) to use or relies on an app
    # wide configuration. Specify it explicitly to decouple Pageflow
    # Scrolled from host application configuration.
    class ReactRenderer < ::React::ServerRendering::BundleRenderer
      def asset_container_class
        ::React::ServerRendering::WebpackerManifestContainer
      end
    end
  end
end
