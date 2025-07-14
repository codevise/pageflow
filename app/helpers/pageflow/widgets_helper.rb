module Pageflow
  module WidgetsHelper
    include RenderJsonHelper

    def render_widget_head_fragments(entry, options = {})
      fragments = entry.resolve_widgets(options).map do |widget|
        widget.widget_type.render_head_fragment_with_configuration(self,
                                                                   entry,
                                                                   widget.configuration)
      end

      safe_join(fragments)
    end

    def render_widgets(entry, options = {})
      fragments = entry.resolve_widgets(options).map do |widget|
        widget.widget_type.render_with_configuration(self, entry, widget.configuration)
      end

      safe_join(fragments)
    end

    def present_widgets_css_class(entry)
      entry.resolve_widgets.map { |widget|
        "widget_#{widget.widget_type.name}_present"
      }.push('widgets_present').join(' ')
    end

    def widget_types_json_seeds(config)
      config.widget_types.each_with_object({}) { |widget_type, result|
        widget_type.roles.each do |role|
          result[role] ||= []
          result[role] << {
            name: widget_type.name,
            translationKey: widget_type.translation_key,
            insertPoint: widget_type.insert_point
          }
        end
      }.to_json.html_safe
    end

    def widgets_json_seeds(entry)
      render_json_seed(entry.resolve_widgets(include_placeholders: true))
    end
  end
end
