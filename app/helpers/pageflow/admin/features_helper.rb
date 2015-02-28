module Pageflow
  module Admin
    module FeaturesHelper
      def feature_state_select_tag(feature_target, feature_name)
        value = FeatureTarget::STATE_MAPPING[feature_target.feature_state(feature_name)]

        select_tag(feature_state_input_name(feature_target, feature_name),
                   options_for_select(feature_states_collection, value))
      end

      def feature_state_input_name(feature_target, feature_name)
        param_key = feature_target.class.model_name.param_key
        "#{param_key}[feature_states][#{feature_name}]"
      end

      def feature_states_collection
        {
          I18n.t('pageflow.admin.features.states.undefined') => nil,
          I18n.t('pageflow.admin.features.states.enabled') => FeatureTarget::STATE_MAPPING[true],
          I18n.t('pageflow.admin.features.states.disabled') => FeatureTarget::STATE_MAPPING[false]
        }
      end
    end
  end
end
