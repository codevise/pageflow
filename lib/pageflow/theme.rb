module Pageflow
  class Theme
    attr_reader :name, :directory_name, :options

    def initialize(name, options = {})
      @name = name.to_s
      @directory_name = name.to_s
      @options = options
    end

    def stylesheet_path
      "pageflow/themes/#{name}.css"
    end

    def has_home_button?
      !@options[:no_home_button]
    end

    def has_scroll_back_indicator?
      !!@options[:scroll_back_indicator]
    end
  end
end
