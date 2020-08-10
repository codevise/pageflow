module Pageflow
  module React
    # @deprecated Use `PageflowPaged::React.create_page_type` instead.
    def self.create_page_type(name, options = {})
      PageflowPaged::React.create_page_type(name, options)
    end

    # @deprecated Use `PageflowPaged::React.create_widget_type` instead.
    def self.create_widget_type(name, role, options = {})
      PageflowPaged::React.create_widget_type(name, role, options)
    end
  end
end
