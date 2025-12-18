module PageflowScrolled
  # Callable that ensures a scale with the given prefix is defined
  # in theme options. If the theme already defines any properties
  # with the prefix, the defaults are not added.
  #
  # @api private
  class ThemeOptionsDefaultScale
    def initialize(prefix:, values:)
      @prefix = prefix
      @values = values
    end

    def call(options)
      return options if scale_defined?(options)

      options.deep_merge(
        properties: {
          root: prefixed_values
        }
      )
    end

    private

    def scale_defined?(options)
      options.dig(:properties, :root)&.keys&.any? do |key|
        key.to_s.start_with?("#{@prefix}-")
      end
    end

    def prefixed_values
      @values.transform_keys { |key| "#{@prefix}-#{key}" }
    end
  end
end
