require 'spec_helper'

module Pageflow
  describe '#theme_customizations' do
    before do
      TestPaperclipProcessor.reset
    end

    it 'allows overriding theme options' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      site = create(:site)
      entry = create(:published_entry,
                     site:,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(site:,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})

      expect(entry.theme.options).to match(colors: {accent: '#0f0', surface: '#000'})
    end

    it 'allows previewing overriding theme options in an entry' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      site = create(:site)
      entry = create(:entry,
                     site:,
                     type_name: 'rainbow',
                     draft_attributes: {theme_name: 'dark'})

      preview_entry =
        Pageflow.theme_customizations.preview(site:,
                                              entry:,
                                              overrides: {colors: {accent: '#0f0'}})

      expect(preview_entry.theme.options).to match(colors: {accent: '#0f0', surface: '#000'})
    end

    it 'does not update customization when previewing' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      site = create(:site)
      entry = create(:entry,
                     site:,
                     type_name: 'rainbow',
                     draft_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.preview(site:,
                                            entry:,
                                            overrides: {colors: {accent: '#0f0'}})

      customization =
        Pageflow.theme_customizations.get(site:,
                                          entry_type_name: 'rainbow')

      expect(customization.overrides).to eq({})
    end

    it 'allows reading overrides' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      site = create(:site)

      Pageflow.theme_customizations.update(site:,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})
      customization =
        Pageflow.theme_customizations.get(site:,
                                          entry_type_name: 'rainbow')

      expect(customization.overrides).to match(colors: {accent: '#0f0'})
    end

    it 'returns empty overrides by default' do
      pageflow_configure do |config|
        TestEntryType.register(config, name: 'rainbow')
      end
      site = create(:site)

      customization =
        Pageflow.theme_customizations.get(site:,
                                          entry_type_name: 'rainbow')

      expect(customization.overrides).to eq({})
    end

    it 'is scoped by site' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end
      end
      site = create(:site)
      other_site = create(:site)
      entry = create(:published_entry,
                     site:,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(site:,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#ff0'}})
      Pageflow.theme_customizations.update(site: other_site,
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

      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'other',
                                           overrides: {colors: {accent: '#0f0'}})

      expect(entry.theme.options).to match(colors: {accent: '#f00', surface: '#000'})
    end

    it 'supports transforming overrides via lambda from config' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')
        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})

          c.transform_theme_customization_overrides = lambda do |overrides, _|
            overrides.except(:colors)
          end
        end
      end
      entry = create(:published_entry,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})

      expect(entry.theme.options).to match(colors: {accent: '#f00', surface: '#000'})
    end

    it 'passes entry and theme when transforming overrides' do
      transform = double('transform', call: {})
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')
        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark')
        end

        config.transform_theme_customization_overrides = transform
      end
      entry = create(:published_entry,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})
      entry.theme

      expect(transform)
        .to have_received(:call).with({colors: {accent: '#0f0'}},
                                      entry:,
                                      theme: entry.revision.theme)
    end

    it 'passes entry and theme when transforming overrides during preview' do
      transform = double('transform', call: {})
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')
        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark')
        end

        config.transform_theme_customization_overrides = transform
      end
      entry = create(:entry,
                     type_name: 'rainbow',
                     draft_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.preview(site: entry.site,
                                            entry:,
                                            overrides: {colors: {accent: '#0f0'}})

      expect(transform)
        .to have_received(:call).with({colors: {accent: '#0f0'}},
                                      entry: kind_of(PublishedEntry),
                                      theme: entry.draft.theme)
    end

    it 'scopes lambda to transform overrides to entry type' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')
        other_entry_type = TestEntryType.register(config, name: 'other')

        config.for_entry_type(rainbow_entry_type) do |c|
          c.themes.register('dark', colors: {accent: '#f00', surface: '#000'})
        end

        config.for_entry_type(other_entry_type) do |c|
          c.transform_theme_customization_overrides = lambda do |overrides, _|
            overrides.except(:colors)
          end
        end
      end
      entry = create(:published_entry,
                     type_name: 'rainbow',
                     revision_attributes: {theme_name: 'dark'})

      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           overrides: {colors: {accent: '#0f0'}})

      expect(entry.theme.options).to match(colors: {accent: '#0f0', surface: '#000'})
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

      file = Pageflow.theme_customizations.upload_file(site: entry.site,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       attachment: fixture_file_upload('image.png'))
      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           file_ids: {inverted_logo: file.id})

      expect(TestPaperclipProcessor.invoked_with_options)
        .to include(hash_including(custom: :option))
      expect(entry.theme.files).to match(inverted_logo: {small: %r{small/image.png}})
    end

    it 'allows including original url, but ignores processing', unstub_paperclip: true do
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 logo: {
                                   styles: {original: {processors: [:test]}},
                                   content_type: %r{\Aimage/.*\Z}
                                 }
                               })
      end
      entry = create(:published_entry, type_name: 'rainbow')

      file = Pageflow.theme_customizations.upload_file(site: entry.site,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       attachment: fixture_file_upload('image.png'))
      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           file_ids: {inverted_logo: file.id})

      expect(TestPaperclipProcessor.invoked_with_options).to be_empty
      expect(entry.theme.files).to match(inverted_logo: {original: %r{original/image.png}})
    end

    it 'allows passing lambda as styles', unstub_paperclip: true do
      Paperclip.register_processor(:test, TestPaperclipProcessor)
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 logo: {
                                   styles: lambda do |file|
                                     {
                                       small: {
                                         processors: [:test],
                                         custom: file.file_name
                                       }
                                     }
                                   end,
                                   content_type: %r{\Aimage/.*\Z}
                                 }
                               })
      end
      entry = create(:published_entry, type_name: 'rainbow')

      file = Pageflow.theme_customizations.upload_file(site: entry.site,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       attachment: fixture_file_upload('image.png'))
      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           file_ids: {inverted_logo: file.id})

      expect(TestPaperclipProcessor.invoked_with_options)
        .to include(hash_including(custom: 'image.png'))
      expect(entry.theme.files).to match(inverted_logo: {small: %r{small/image.png}})
    end

    it 'validates uploads by content type' do
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 sound: {content_type: %r{\Aaudio/.*\Z}}
                               })
      end
      entry = create(:published_entry, type_name: 'rainbow')

      expect {
        Pageflow.theme_customizations.upload_file(site: entry.site,
                                                  entry_type_name: 'rainbow',
                                                  type_name: 'sound',
                                                  attachment: fixture_file_upload('image.png'))
      }.to raise_error(/content type invalid/)
    end

    it 'supports transforming files via lambda from config' do
      pageflow_configure do |config|
        rainbow_entry_type = TestEntryType.register(config,
                                                    name: 'rainbow',
                                                    theme_files: {
                                                      logo: {
                                                        styles: {small: '300x300>'},
                                                        content_type: %r{\Aimage/.*\Z}
                                                      }
                                                    })

        config.for_entry_type(rainbow_entry_type) do |c|
          c.transform_theme_customization_files = lambda do |files, _entry|
            files.except(:inverted_logo)
          end
        end
      end
      entry = create(:published_entry, type_name: 'rainbow')

      file = Pageflow.theme_customizations.upload_file(site: entry.site,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       attachment: fixture_file_upload('image.png'))
      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           file_ids: {logo: file.id,
                                                      inverted_logo: file.id})

      expect(entry.theme.files).to match(logo: {small: %r{small/image.png}})
    end

    it 'passes entry and theme when transforming files' do
      transform = double('transform', call: {})
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 logo: {
                                   styles: {small: '300x300>'},
                                   content_type: %r{\Aimage/.*\Z}
                                 }
                               })

        config.transform_theme_customization_files = transform
      end
      entry = create(:published_entry, type_name: 'rainbow')

      file = Pageflow.theme_customizations.upload_file(site: entry.site,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       attachment: fixture_file_upload('image.png'))
      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           file_ids: {inverted_logo: file.id})

      entry.theme.files

      expect(transform)
        .to have_received(:call).with({
                                        inverted_logo: {
                                          small: %r{small/image.png}
                                        }
                                      },
                                      entry:,
                                      theme: entry.revision.theme)
    end

    it 'allows reading urls of uploaded file from upload return value' do
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 logo: {
                                   styles: {original: {}, small: '300x300>'},
                                   content_type: %r{\Aimage/.*\Z}
                                 }
                               })
      end
      entry = create(:published_entry, type_name: 'rainbow')

      file = Pageflow.theme_customizations.upload_file(site: entry.site,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       attachment: fixture_file_upload('image.png'))

      expect(file.urls[:original]).to match(%r{original/image.png})
      expect(file.urls[:small]).to match(%r{small/image.png})
    end

    it 'allows reading name and urls of uploaded file from theme customization' do
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'rainbow',
                               theme_files: {
                                 logo: {
                                   styles: {original: {}, small: '300x300>'},
                                   content_type: %r{\Aimage/.*\Z}
                                 }
                               })
      end
      entry = create(:published_entry, type_name: 'rainbow')

      file = Pageflow.theme_customizations.upload_file(site: entry.site,
                                                       entry_type_name: 'rainbow',
                                                       type_name: 'logo',
                                                       attachment: fixture_file_upload('image.png'))
      Pageflow.theme_customizations.update(site: entry.site,
                                           entry_type_name: 'rainbow',
                                           file_ids: {inverted_logo: file.id})
      customization = Pageflow.theme_customizations.get(site: entry.site,
                                                        entry_type_name: 'rainbow')

      expect(customization.selected_files[:inverted_logo].file_name).to eq('image.png')
      expect(customization.selected_files[:inverted_logo].urls[:original])
        .to match(%r{original/image.png})
      expect(customization.selected_files[:inverted_logo].urls[:small])
        .to match(%r{small/image.png})
    end
  end
end
