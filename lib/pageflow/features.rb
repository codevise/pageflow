module Pageflow
  # A registry of [Feature} objects.
  #
  # @since edge
  class Features
    include Enumerable

    # @api private
    def initialize
      @features = {}
      @enabled_features = []
    end

    # Register a feature that can be enabled for accounts of
    # entries. If the first parameter is a string, a block can be
    # passed to provide the enable method. If only a string is passed,
    # enabling the feature is no-op.
    #
    # @overload register(feature)
    #   @param feature [Feature]
    #
    # @overload register(feature)
    #   @param feature [String]
    #   @yieldparam config [Configuration] Use the block as enable
    #     method.
    #
    # @overload register(feature)
    #   @param feature [String]
    def register(feature, &block)
      if feature.is_a?(String)
        return register(Feature.new(feature, &block))
      end

      if @features.key?(feature.name)
        raise(ArgumentError, "Feature #{feature.name} is already registered.")
      end

      @features[feature.name] = feature
    end

    # Check if a feature has been enabled.
    #
    # @return [Boolean]
    def enabled?(name)
      @enabled_features.include?(name)
    end

    # @api private
    def enable(names, config)
      @enabled_features = names

      names.each do |name|
        raise(ArgumentError, "Cannot enable unknown feature #{name}.") unless @features.key?(name)

        @features[name].enable(config)
      end
    end

    # @api private
    def enable_all(config)
      enable(@features.keys, config)
    end

    def each(&block)
      @features.values.each(&block)
    end
  end
end
