module PageflowPaged
  # @api private
  module ReactServerSideRenderingHelper
    def render_page_react_component(entry, page, component_name)
      return '' if page.perma_id.blank?

      extra_props_string = %("pageId": #{page.perma_id}, "pageType": "#{page.template}")
      render_react_component_with_seed(entry, component_name, extra_props_string)
    end

    def render_widget_react_component(entry, widget_type_name, component_name)
      render_react_component_with_seed(entry,
                                       component_name,
                                       %("widgetTypeName": "#{widget_type_name}"))
    end

    def self.renderer
      @renderer ||=
        ReactRenderer.new(files: ['pageflow_paged/server_rendering.js'])
    end

    private

    def render_react_component_with_seed(entry, component_name, extra_props_string)
      seed = (@_pageflow_react_entry_seed ||= entry_json_seed(entry))
      props_string = %({ "resolverSeed": #{seed}, #{extra_props_string} })

      ReactServerSideRenderingHelper.renderer.render(component_name, props_string, true)
    end

    # Normally react-rails either tries to auto detect which asset
    # container (i.e. Webpack, Sprockets) to use or relies on an app
    # wide configuration. Since Pageflow Paged and Scrolled need
    # different asset containers, this renderer specifies it
    # explicitly.
    class ReactRenderer < ::React::ServerRendering::BundleRenderer
      def asset_container_class
        if assets_precompiled?
          ::React::ServerRendering::ManifestContainer
        else
          ::React::ServerRendering::EnvironmentContainer
        end
      end
    end
  end
end
