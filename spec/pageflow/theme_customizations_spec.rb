require 'spec_helper'

module Pageflow
  describe '#theme_customizations' do
    it 'allows overriding theme options' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      account = create(:account)
      entry = create(:published_entry,
                     account: account,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(account: account,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})

      expect(entry.theme.options).to match(colors: {accent: '#0f0', surface: '#000'})
    end

    it 'allows reading overrides' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      account = create(:account)

      Pageflow.theme_customizations.update(account: account,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})
      result =
        Pageflow.theme_customizations.get_overrides(account: account,
                                                    entry_type_name: 'rainbow')

      expect(result).to match(colors: {accent: '#0f0'})
    end

    it 'returns empty overrides by default' do
      pageflow_configure do |config|
        TestEntryType.register(config, name: 'rainbow')
      end
      account = create(:account)

      result =
        Pageflow.theme_customizations.get_overrides(account: account,
                                                    entry_type_name: 'rainbow')

      expect(result).to eq({})
    end

    it 'is scoped by account' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      account = create(:account)
      other_account = create(:account)
      entry = create(:published_entry,
                     account: account,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(account: account,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#ff0'}})
      Pageflow.theme_customizations.update(account: other_account,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})

      expect(entry.theme.options).to match(colors: {accent: '#ff0', surface: '#000'})
    end

    it 'is scoped by entry type' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')
        TestEntryType.register(config, name: 'other')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      entry = create(:published_entry,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(account: entry.account,
                                           entry_type_name: 'other',
                                           overrides: {colors: {accent: '#0f0'}})

      expect(entry.theme.options).to match(colors: {accent: '#f00', surface: '#000'})
    end
  end
end
