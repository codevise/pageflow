module Pageflow
  module Admin
    module FeaturesHelper # rubocop:todo Style/Documentation
      def feature_state_select_tag(feature_target, feature_name)
        own_state = feature_target.own_feature_state(feature_name)
        inherited_state = feature_target.inherited_feature_state(feature_name)

        value = FeatureTarget::STATE_MAPPING[own_state]
        collection = feature_states_collection(inherited_state)

        select_tag(feature_state_input_name(feature_target, feature_name),
                   options_for_select(collection, value))
      end

      def feature_state_input_name(feature_target, feature_name)
        param_key = feature_target.class.model_name.param_key
        "#{param_key}[feature_states][#{feature_name}]"
      end

      def feature_states_collection(inherited_feature_state)
        default_item_label = I18n.t('pageflow.admin.features.states.default',
                                    inherited: feature_state_display_name(inherited_feature_state))
        {
          default_item_label => FeatureTarget::STATE_MAPPING[nil],
          feature_state_display_name(true) => FeatureTarget::STATE_MAPPING[true],
          feature_state_display_name(false) => FeatureTarget::STATE_MAPPING[false]
        }
      end

      def feature_state_display_name(state)
        I18n.t(FeatureTarget::STATE_MAPPING[state],
               scope: 'pageflow.admin.features.states')
      end
    end
  end
end
