module Pageflow
  class Themes # rubocop:todo Style/Documentation
    include Enumerable

    def initialize
      @themes = HashWithIndifferentAccess.new
      @default_options = {}
      @options_transforms = []
    end

    # Register default options that apply to all themes. Can be called
    # multiple times to accumulate defaults from different sources
    # (gem, plugins, host app). Later calls override earlier ones for
    # the same keys. Theme options always take precedence over defaults.
    #
    # @param options [Hash]
    #   Default options to deep merge into accumulated defaults.
    #
    # @since edge
    def register_default_options(options)
      @default_options = @default_options.deep_merge(options)
    end

    # Register a transform that can conditionally modify theme options.
    # Transforms run after defaults are merged with theme options, so
    # they can inspect what the theme defines and add conditional defaults.
    #
    # @param callable [#call]
    #   Receives merged options hash, returns transformed options.
    #   Use for conditional defaults based on what theme defines.
    #
    # @since edge
    def register_options_transform(callable)
      @options_transforms << callable
    end

    # Apply all registered defaults to theme options.
    #
    # @api private
    def apply_default_options(options, entry:)
      # First merge hash defaults under theme options (theme wins)
      result = @default_options.deep_merge(options)

      # Then apply callable transforms (they can see theme options)
      @options_transforms.reduce(result) do |opts, transform|
        transform.call(opts, entry:)
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
