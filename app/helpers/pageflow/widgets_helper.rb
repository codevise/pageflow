module Pageflow
  module WidgetsHelper
    def render_widgets(entry, options = {})
      fragments = entry.widgets.resolve(options).map do |widget|
        widget.widget_type.render(self, entry)
      end

      safe_join(fragments)
    end

    def widget_types_json_seeds
      Pageflow.config.widget_types.each_with_object({}) do |widget_type, result|
        widget_type.roles.each do |role|
          result[role] ||= []
          result[role] << {
            name: widget_type.name,
            translationKey: widget_type.translation_key
          }
        end
      end.to_json.html_safe
    end
  end
end
