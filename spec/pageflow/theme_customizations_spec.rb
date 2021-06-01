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

    it 'allows uploading and processing theme files', unstub_paperclip: true do
      Paperclip.register_processor(:test, TestPaperclipProcessor)
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 logo: {
                                   styles: {small: {processors: [:test], custom: :option}},
                                   content_type: %r{\Aimage/.*\Z}
                                 }
                               })
      end
      entry = create(:published_entry, type_name: 'rainbow')

      file = Pageflow.theme_customizations.upload_file(account: entry.account,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       file: fixture_file_upload('image.png'))
      Pageflow.theme_customizations.update(account: entry.account,
                                           entry_type_name: 'rainbow',
                                           file_ids: {inverted_logo: file.id})

      expect(TestPaperclipProcessor.invoked_with_options)
        .to include(hash_including(custom: :option))
      expect(entry.theme.files).to match(inverted_logo: {small: %r{small/image.png}})
    end

    it 'validates uploads by content type', unstub_paperclip: true do
      Paperclip.register_processor(:test, TestPaperclipProcessor)
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 sound: {content_type: %r{\Aaudio/.*\Z}}
                               })
      end
      entry = create(:published_entry, type_name: 'rainbow')

      expect {
        Pageflow.theme_customizations.upload_file(account: entry.account,
                                                  entry_type_name: 'rainbow',
                                                  type_name: 'sound',
                                                  file: fixture_file_upload('image.png'))
      }.to raise_error(/content type invalid/)
    end
  end
end
