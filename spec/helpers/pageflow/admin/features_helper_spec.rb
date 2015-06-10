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

        it 'sets value according to feature starte' do
          target = build(:account, features_configuration: {'fancy_page_type' => true})

          html = feature_state_select_tag(target, 'fancy_page_type')

          expect(html).to have_selector('option[value="enabled"][selected]')
        end
      end
    end
  end
end
