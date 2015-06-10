require 'spec_helper'

module Pageflow
  describe FeatureTarget do
    describe '#enabled_feature_names' do
      it 'returns names of enabled features' do
        target = build(:feature_target, features_configuration: {'sitemap' => true, 'other' => false})

        Pageflow.config.features.register('sitemap')
        Pageflow.config.features.register('fancy_page_type')

        result = target.enabled_feature_names

        expect(result).to eq(['sitemap'])
      end
    end

    describe '#feature_states=' do
      it 'does not change unmentioned featues' do
        target = build(:feature_target, features_configuration: {'other' => true})

        result = target.feature_states = {
          'sitemap' => true,
          'not_wanted' => false
        }

        expect(target.feature_state('sitemap')).to eq(true)
        expect(target.feature_state('not_wanted')).to eq(false)
        expect(target.feature_state('other')).to eq(true)
      end

      it 'supports "on" and "off" values for features' do
        target = build(:feature_target)

        result = target.feature_states = {
          'sitemap' => 'enabled',
          'other' => 'disabled'
        }

        expect(target.feature_state('sitemap')).to eq(true)
        expect(target.feature_state('other')).to eq(false)
      end
    end
  end
end
