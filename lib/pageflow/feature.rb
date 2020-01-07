module Pageflow
  # Represents a set of configuration changes that can be performed
  # based on account or entry feature flags.
  #
  # @since 0.9
  class Feature
    # Unique identifyer of feature.
    #
    # @return [String]
    attr_reader :name

    # Translation key to represent the feature in the UI.
    #
    # @return [String]
    attr_reader :name_translation_key

    # Create a block based feature.
    #
    # @param name [String] Unique identifyer of feature.
    #
    # @param name_translation_key [String] Translation key to
    #   represent the feature in the UI.
    #
    # @yieldparam config [Configuration] The configuration object to manipulate.
    def initialize(name, name_translation_key: nil, &block)
      @name = name
      @name_translation_key = name_translation_key || "pageflow.#{name}.feature_name"
      @block = block
    end

    # Perform any configuration change that is needed to activate this
    # feature.
    #
    # @param config [Configuration]
    def enable(config)
      @block.call(config) if @block
    end
  end
end
