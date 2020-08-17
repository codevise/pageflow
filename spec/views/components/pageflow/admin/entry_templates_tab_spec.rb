require 'spec_helper'

module Pageflow
  describe Admin::EntryTemplatesTab, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
    end

    it "has entries even if corresponding entry templates aren't created yet" do
      pageflow_configure do |config|
        TestEntryType.register(config, name: 'ponies')
        TestEntryType.register(config, name: 'rainbows')
        TestEntryType.register(config, name: 'glitter')
      end

      account = create(:account)

      render(account.themings.first)

      expect(rendered).to have_text('ponies')
      expect(rendered).to have_text('rainbows')
      expect(rendered).to have_text('glitter')
    end

    it 'only has entries if entry type feature is enabled for account' do
      pageflow_configure do |config|
        config.features.register('ponies_entry_type') do |feature_config|
          TestEntryType.register(feature_config, name: 'ponies')
        end
        config.features.register('rainbows_entry_type') do |feature_config|
          TestEntryType.register(feature_config, name: 'rainbows')
        end
        config.features.enable_by_default('ponies_entry_type')
        config.features.enable_by_default('rainbows_entry_type')
      end

      account = create(:account, features_configuration: {
                         'rainbows_entry_type' => false
                       })

      render(account.themings.first)

      expect(rendered).to have_text('ponies')
      expect(rendered).not_to have_text('rainbows')
    end

    it "hides existing entry template if feature isn't active" do
      pageflow_configure do |config|
        config.features.register('rainbows_entry_type') do |feature_config|
          TestEntryType.register(feature_config, name: 'rainbows')
        end
        config.features.register('ponies_entry_type') do |feature_config|
          TestEntryType.register(feature_config, name: 'ponies')
        end
        config.features.enable_by_default('rainbows_entry_type')
        config.features.enable_by_default('ponies_entry_type')
      end

      account = create(:account)
      create(:entry_template, account: account, entry_type_name: 'rainbows')
      account.update(features_configuration: {
                       'rainbows_entry_type' => false
                     })
      create(:entry_template, account: account, entry_type_name: 'ponies')

      render(account.themings.first)

      expect(rendered).not_to have_text('rainbows')
      expect(rendered).to have_text('ponies')
    end
  end
end
