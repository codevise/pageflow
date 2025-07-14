module Dom
  module Admin
    class FeaturesForm < Domino
      selector 'form.features'

      def submit_with(features)
        within(node) do
          features.each do |name, value|
            text = I18n.t(Pageflow::FeatureTarget::STATE_MAPPING[value],
                          scope: 'pageflow.admin.features.states')
            select(text, from: "account_feature_states_#{name}")
          end

          find('[name="commit"]').click
        end
      end
    end
  end
end
