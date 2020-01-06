module Pageflow
  # @api private
  module FeatureTarget
    STATE_MAPPING = {
      true => 'enabled',
      false => 'disabled',
      nil => 'default'
    }

    extend ActiveSupport::Concern

    included do
      serialize :features_configuration, JSON
    end

    def enabled_feature_names(config = Pageflow.config_for(self))
      config.features.select { |feature|
        feature_state(feature.name) == true
      }.map(&:name)
    end

    def feature_state(name)
      state = own_feature_state(name)
      state == nil ? inherited_feature_state(name) : state
    end

    def own_feature_state(name)
      features_configuration[name]
    end

    def inherited_feature_state(name)
      Pageflow.config.features.enabled_by_default?(name)
    end

    def feature_states=(states)
      boolean_states = states.each_with_object({}) do |(key, value), result|
        if value == true || value == STATE_MAPPING[true]
          result[key] = true
        elsif value == false || value == STATE_MAPPING[false]
          result[key] = false
        elsif value.blank? || value == STATE_MAPPING[nil]
          result[key] = nil
        end
      end

      self.features_configuration = features_configuration
        .merge(boolean_states)
        .reject { |_, value| value.nil? }
    end

    def features_configuration
      self[:features_configuration] || {}
    end
  end
end
