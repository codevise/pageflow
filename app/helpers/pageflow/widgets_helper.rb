module Pageflow
  module WidgetsHelper
    def render_widgets(entry, options = {})
      fragments = entry.widgets.resolve(options).map do |widget|
        widget.widget_type.render(self, entry)
      end

      safe_join(fragments)
    end
  end
end
