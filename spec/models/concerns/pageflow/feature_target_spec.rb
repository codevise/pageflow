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

      it 'includes features which are enabled by default' do
        target = build(:feature_target, features_configuration: {})

        Pageflow.config.features.register('fancy_page_type')
        Pageflow.config.features.enable_by_default('fancy_page_type')

        result = target.enabled_feature_names

        expect(result).to eq(['fancy_page_type'])
      end

      it 'does not include default features which are disabled for target' do
        target = build(:feature_target, features_configuration: {'fancy_page_type' => false})

        Pageflow.config.features.register('fancy_page_type')
        Pageflow.config.features.enable_by_default('fancy_page_type')

        result = target.enabled_feature_names

        expect(result).to eq([])
      end

      describe 'overriding inherited_feature_state' do
        it 'includes inherited enabled features' do
          Pageflow.config.features.register('some_page_type')
          account = build(:account, features_configuration: {'some_page_type' => true})
          entry = build(:entry, account: account)

          expect(entry.enabled_feature_names).to eq(['some_page_type'])
        end

        it 'includes features enabled by default' do
          pageflow_configure do |config|
            config.features.register('some_page_type')
            config.features.enable_by_default('some_page_type')
          end
          entry = build(:entry)

          expect(entry.enabled_feature_names).to eq(['some_page_type'])
        end

        it 'allows to disable inherited enabled features' do
          Pageflow.config.features.register('some')
          account = build(:account, features_configuration: {'some' => true})
          entry = build(:entry, account: account, features_configuration: {'some' => false})

          expect(entry.enabled_feature_names).to eq([])
        end

        it 'allows to disable inherited features enabled by default' do
          pageflow_configure do |config|
            config.features.register('some_page_type')
            config.features.enable_by_default('some_page_type')
          end
          entry = build(:entry, features_configuration: {'some_page_type' => false})

          expect(entry.enabled_feature_names).to eq([])
        end

        it 'allows parent to disable features enabled by default' do
          Pageflow.config.features.register('some_page_type')
          Pageflow.config.features.enable_by_default('some_page_type')
          account = build(:account, features_configuration: {'some_page_type' => false})
          entry = build(:entry, account: account)

          expect(entry.enabled_feature_names).to eq([])
        end
      end
    end

    describe '#feature_states=' do
      it 'does not change unmentioned featues' do
        target = build(:feature_target, features_configuration: {'other' => true})

        target.feature_states = {
          'sitemap' => true,
          'not_wanted' => false
        }

        expect(target.feature_state('sitemap')).to eq(true)
        expect(target.feature_state('not_wanted')).to eq(false)
        expect(target.feature_state('other')).to eq(true)
      end

      it 'supports "enabled" and "disabled" values for features' do
        target = build(:feature_target, features_configuration: {'other' => true})

        target.feature_states = {
          'sitemap' => 'enabled',
          'other' => 'disabled'
        }

        expect(target.feature_state('sitemap')).to eq(true)
        expect(target.feature_state('other')).to eq(false)
      end

      it 'removes keys for features with blank state' do
        target = build(:feature_target,
                       features_configuration: {'sitemap' => true, 'other' => false})

        target.feature_states = {
          'sitemap' => nil,
          'other' => ''
        }

        expect(target.own_feature_state('sitemap')).to eq(nil)
        expect(target.own_feature_state('other')).to eq(nil)
      end

      it 'removes keys with "default" value' do
        target = build(:feature_target, features_configuration: {'sitemap' => true})

        target.feature_states = {
          'sitemap' => 'default'
        }

        expect(target.own_feature_state('sitemap')).to eq(nil)
      end
    end
  end
end
