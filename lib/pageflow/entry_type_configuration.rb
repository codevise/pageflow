module Pageflow
  # Include in entry type specific configuration classes.
  #
  # @since 15.1
  module EntryTypeConfiguration
    # @api private
    def initialize(config, entry_type)
      @config = config
      @features = FeaturesDelegator.new(config, entry_type)
    end

    attr_reader :features

    delegate :file_types, to: :@config
    delegate :help_entries, to: :@config
    delegate :hooks, to: :@config
    delegate :revision_components, to: :@config
    delegate :themes, to: :@config
    delegate :widget_types, to: :@config

    def plugin(plugin)
      plugin.configure(self)
    end

    # @api private
    FeaturesDelegator = Struct.new(:config, :entry_type) do
      def register(feature, &block)
        return register(Feature.new(feature, &block)) if feature.is_a?(String)

        entry_type_feature = Feature.new(
          feature.name,
          name_translation_key: feature.name_translation_key
        ) do |feature_config|
          feature_config.for_entry_type(entry_type, &feature.method(:enable))
        end

        config.features.register(entry_type_feature)
      end

      def enable_by_default(name)
        config.features.enable_by_default(name)
      end
    end
  end
end
