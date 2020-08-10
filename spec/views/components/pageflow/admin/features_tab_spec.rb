require 'spec_helper'

module Pageflow
  describe Admin::FeaturesTab, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
      helper.extend(Pageflow::Admin::FormHelper)
      helper.extend(Pageflow::Admin::FeaturesHelper)
    end

    it 'displays fields for account features of passed theming' do
      pageflow_configure do |config|
        config.features.register('some_feature')
      end

      theming = create(:theming)

      render(theming)

      expect(rendered).to have_selector('select[name*=some_feature]')
    end

    it 'displays fields for features of passed entry' do
      pageflow_configure do |config|
        config.features.register('some_feature')
      end

      entry = create(:entry)

      render(entry)

      expect(rendered).to have_selector('select[name*=some_feature]')
    end

    it 'displays fields for features registed for entry type of passed entry' do
      pageflow_configure do |config|
        some_entry_type = TestEntryType.register(config, name: 'some')

        config.for_entry_type(some_entry_type) do |entry_type_config|
          entry_type_config.features.register('some_feature')
        end
      end

      entry = create(:entry, type_name: 'some')

      render(entry)

      expect(rendered).to have_selector('select[name*=some_feature]')
    end

    it 'does not display fields for features registered for other entry type' do
      pageflow_configure do |config|
        TestEntryType.register(config, name: 'some')
        other_entry_type = TestEntryType.register(config, name: 'other')

        config.for_entry_type(other_entry_type) do |entry_type_config|
          entry_type_config.features.register('some_feature')
        end
      end

      entry = create(:entry, type_name: 'some')

      render(entry)

      expect(rendered).not_to have_selector('select[name*=some_feature]')
    end
  end
end
