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

    private

    def render_react_component_with_seed(entry, component_name, extra_props_string)
      seed = (@_pageflow_react_entry_seed ||= entry_json_seed(entry))
      props_string = %({ "resolverSeed": #{seed}, #{extra_props_string} })

      ::React::ServerRendering.render(component_name, props_string, true)
    end
  end
end
