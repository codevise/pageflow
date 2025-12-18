module Pageflow
  class Themes # rubocop:todo Style/Documentation
    include Enumerable

    def initialize
      @themes = HashWithIndifferentAccess.new
      @options_transforms = []
    end

    # Register default options that apply to all themes. Can be called
    # multiple times to accumulate defaults from different sources
    # (gem, plugins, host app).
    #
    # @overload register_default_options(options)
    #   @param options [Hash]
    #     Default options to deep merge into theme options.
    #
    # @overload register_default_options(callable)
    #   @param callable [#call]
    #     Receives options hash, returns transformed options.
    #     Use for conditional defaults based on what theme defines.
    #
    # @since edge
    def register_default_options(options_or_callable)
      @options_transforms << if options_or_callable.respond_to?(:call)
                               options_or_callable
                             else
                               ->(options) { options_or_callable.deep_merge(options) }
                             end
    end

    # Apply all registered defaults to theme options.
    #
    # @api private
    def apply_default_options(options)
      @options_transforms.reduce(options.deep_dup) do |opts, transform|
        transform.call(opts)
      end
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
    #
    # @option options :logo_url [String]
    #   Pass logo url as string to turn the logo in navigation bar into a link.
    #
    def register(name, options = {})
      @themes[name] = Theme.new(name, options)
    end

    def get(name)
      @themes.fetch(name) { raise(ArgumentError, "Unknown theme '#{name}'.") }
    end

    def names
      map(&:name)
    end

    def each(&)
      @themes.values.each(&)
    end
  end
end
