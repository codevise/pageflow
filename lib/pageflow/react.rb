module Pageflow
  module React
    def self.create_page_type(name, options = {})
      Pageflow::React::PageType.new(name, options)
    end

    def self.create_widget_type(name, role, options = {})
      Pageflow::React::WidgetType.new(name, role, options)
    end
  end
end
