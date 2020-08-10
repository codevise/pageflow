module PageflowPaged
  # Create React based page and widget types
  module React
    def self.create_page_type(name, options = {})
      PageflowPaged::React::PageType.new(name, options)
    end

    def self.create_widget_type(name, role, options = {})
      PageflowPaged::React::WidgetType.new(name, role, options)
    end
  end
end
