module Pageflow
  # Include in entry type specific configuration classes.
  #
  # @since edge
  module EntryTypeConfiguration
    # @api private
    def initialize(config, entry_type)
      @config = config
      @features = FeaturesDelegator.new(config, entry_type)
    end

    attr_reader :features

    delegate :file_types, to: :@config
    delegate :widget_types, to: :@config

    # @api private
    FeaturesDelegator = Struct.new(:config, :entry_type) do
      def register(feature, &block)
        return register(Feature.new(feature, &block)) if feature.is_a?(String)

        config.features.register(feature.name) do |feature_config|
          feature_config.for_entry_type(entry_type, &feature.method(:enable))
        end
      end

      def enable_by_default(name)
        config.features.enable_by_default(name)
      end
    end
  end
end
