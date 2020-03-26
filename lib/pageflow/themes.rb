module Pageflow
  class Themes
    include Enumerable

    def initialize
      @themes = HashWithIndifferentAccess.new
    end

    # Register a theme and supply theme options.
    #
    # @param name [Symbol]
    #   Used in conventional directory names.
    #
    # @option options :no_home_button [Boolean]
    #   Pass true if theme does not display home buttons in navigation
    #   bars.
    #
    # @option options :scroll_back_indicator [Boolean]
    #   Pass true if theme has styles for an indicator pointing to the
    #   previous page.
    #
    # @option options :scroll_indicator_modes [Boolean]
    #   Pass true if theme supports horizontal scroll indicators.
    #
    # @option options :emphasized_pages [Boolean]
    #   Pass true if theme has styles for emphasized pages in navigation bars.
    #
    # @option options :no_page_change_by_scrolling [Boolean]
    #   Pass true if changing the page by using the mouse wheel shall
    #   be deactivated.
    #
    # @option options :no_hide_text_on_swipe [Boolean]
    #   Pass true if hiding the text by swiping to left shall be
    #   deactivated on mobile devices.
    #
    # @option options :hide_logo_option [Boolean]
    #   Pass true if hiding the logo on specific pages should be supported
    #   as an option in the editor.
    def register(name, options = {})
      @themes[name] = Theme.new(name, options)
    end

    def get(name)
      @themes.fetch(name) { raise(ArgumentError, "Unknown theme '#{name}'.") }
    end

    def names
      map(&:name)
    end

    def each(&block)
      @themes.values.each(&block)
    end
  end
end
