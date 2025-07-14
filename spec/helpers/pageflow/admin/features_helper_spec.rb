require 'spec_helper'

module Pageflow
  module Admin
    describe FeaturesHelper do
      describe '#feature_state_select_tag' do
        it 'derives param_key from feature target' do
          target = build(:account)

          html = feature_state_select_tag(target, 'fancy_page_type')

          expect(html).to have_selector('select[name="account[feature_states][fancy_page_type]"]')
        end

        it 'selects enabled item if feature is enabled for target' do
          target = build(:account, features_configuration: {'fancy_page_type' => true})

          html = feature_state_select_tag(target, 'fancy_page_type')

          expect(html).to have_selector('option[value="enabled"][selected]')
        end

        it 'selects disabled item if feature is disabled for target' do
          target = build(:account, features_configuration: {'fancy_page_type' => false})

          html = feature_state_select_tag(target, 'fancy_page_type')

          expect(html).to have_selector('option[value="disabled"][selected]')
        end

        it 'sets value to default if feature state is inherited' do
          account = build(:account, features_configuration: {'fancy_page_type' => true})
          target = build(:entry, account:)

          html = feature_state_select_tag(target, 'fancy_page_type')

          expect(html).to have_selector('option[value="default"][selected]')
        end

        it 'displays inherited feature state' do
          account = build(:account, features_configuration: {'fancy_page_type' => true})
          target = build(:entry, account:)
          enabled_display_text = I18n.t('pageflow.admin.features.states.enabled')

          html = feature_state_select_tag(target, 'fancy_page_type')

          expect(html).to have_selector('option[selected]', text: enabled_display_text)
        end
      end
    end
  end
end
