module Pageflow
  # @api private
  module FeatureTarget
    STATE_MAPPING = {
      true => 'enabled',
      false => 'disabled'
    }

    extend ActiveSupport::Concern

    included do
      serialize :features_configuration, JSON
    end

    def enabled_feature_names
      Pageflow.config.features.select do |feature|
        feature_state(feature.name) == true
      end.map(&:name)
    end

    def feature_state(name)
      features_configuration[name]
    end

    def feature_states=(states)
      boolean_states = states.each_with_object({}) do |(key, value), result|
        result[key] = (value == true || value == STATE_MAPPING[true])
      end

      self.features_configuration = features_configuration.merge(boolean_states)
    end

    def features_configuration
      super || {}
    end
  end
end
