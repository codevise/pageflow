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

    def preview_image_path
      "pageflow/themes/#{name}/preview.png"
    end

    def preview_thumbnail_path
      "pageflow/themes/#{name}/preview_thumbnail.png"
    end

    def print_logo_path
      "pageflow/themes/#{name}/logo_print.png"
    end

    def has_home_button?
      !@options[:no_home_button]
    end

    def has_overview_button?
      !@options[:no_overview_button]
    end

    def has_scroll_back_indicator?
      !!@options[:scroll_back_indicator]
    end

    def supports_scroll_indicator_modes?
      !!@options[:scroll_indicator_modes]
    end

    def supports_emphasized_pages?
      !!@options[:emphasized_pages]
    end

    def supports_hide_logo_on_pages?
      !!@options[:hide_logo_option]
    end

    def page_change_by_scrolling?
      !@options[:no_page_change_by_scrolling]
    end

    def change_to_parent_page_at_storyline_boundary?
      !@options[:no_change_to_parent_page_at_storyline_boundary]
    end

    def hide_text_on_swipe?
      !@options[:no_hide_text_on_swipe]
    end
  end
end
