module Pageflow
  module WidgetsHelper
    def render_widget_head_fragments(entry, options = {})
      fragments = entry.widgets.resolve(options).map do |widget|
        widget.widget_type.render_head_fragment(self, entry)
      end

      safe_join(fragments)
    end

    def render_widgets(entry, options = {})
      fragments = entry.widgets.resolve(options).map do |widget|
        widget.widget_type.render(self, entry)
      end

      safe_join(fragments)
    end

    def present_widgets_css_class(entry)
      entry.widgets.resolve.map do |widget|
        "widget_#{widget.widget_type.name}_present"
      end.join(' ')
    end

    def widget_types_json_seeds(config)
      config.widget_types.each_with_object({}) do |widget_type, result|
        widget_type.roles.each do |role|
          result[role] ||= []
          result[role] << {
            name: widget_type.name,
            translationKey: widget_type.translation_key
          }
        end
      end.to_json.html_safe
    end

    def widget_types_collection_for_role(config, role)
      config.widget_types.find_all_by_role(role).each_with_object({}) do |widget_type, result|
        result[I18n.t(widget_type.translation_key)] = widget_type.name
      end
    end
  end
end
