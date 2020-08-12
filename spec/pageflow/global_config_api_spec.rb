require 'spec_helper'

module Pageflow
  describe GlobalConfigApi do
    class PageflowModule
      include GlobalConfigApi
    end

    describe '#config' do
      it 'returns configuration available for which all features have been enabled' do
        pageflow = PageflowModule.new

        pageflow.configure do |config|
          config.features.register('some_stuff')
        end
        pageflow.finalize!

        expect(pageflow.config.features.enabled?('some_stuff')).to eq(true)
      end

      it 'raises exception before finalize!' do
        pageflow = PageflowModule.new

        pageflow.configure do |config|
          config.features.register('some_stuff')
        end

        expect {
          pageflow.config
        }.to raise_error(/has not been configured/)
      end

      it 'returns empty configuration if not yet configured is ignored' do
        pageflow = PageflowModule.new

        pageflow.configure do |config|
          config.features.register('some_stuff')
        end

        expect(pageflow.config(ignore_not_configured: true)).to be_kind_of(Configuration)
      end

      it 'returns all global file types as well as those for entry types' do
        entry_type = TestEntryType.new(name: 'skulled')
        entry_type2 = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 collection_name: 'image_files')
        file_type2 = FileType.new(model: 'Pageflow::VideoFile',
                                  collection_name: 'video_files')
        file_type3 = FileType.new(model: 'Pageflow::AudioFile',
                                  collection_name: 'audio_files')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.entry_types.register(entry_type2)
          config.for_entry_type(entry_type) do |c|
            c.file_types.register(file_type)
          end
          config.for_entry_type(entry_type2) do |c|
            c.file_types.register(file_type2)
          end
          config.file_types.register(file_type3)
        end
        pageflow.finalize!

        expect(pageflow.config.file_types.count).to eq 3
      end

      it 'handles duplicate file types' do
        entry_type = TestEntryType.new(name: 'skulled')
        entry_type2 = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 collection_name: 'image_files')
        file_type2 = FileType.new(model: 'Pageflow::ImageFile',
                                  collection_name: 'le_image_files')
        file_type3 = FileType.new(model: 'Pageflow::AudioFile',
                                  collection_name: 'audio_files')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.entry_types.register(entry_type2)
          config.for_entry_type(entry_type) do |c|
            c.file_types.register(file_type)
          end
          config.for_entry_type(entry_type2) do |c|
            c.file_types.register(file_type2)
          end
          config.file_types.register(file_type3)
        end
        pageflow.finalize!

        expect(pageflow.config.file_types.count).to eq 2
      end

      it 'returns all global widget types as well as those for entry types' do
        entry_type = TestEntryType.new(name: 'skulled')
        entry_type2 = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        widget_type = TestWidgetType.new(name: 'test_widget')
        widget_type2 = TestWidgetType.new(name: 'test_fidget')
        widget_type3 = TestWidgetType.new(name: 'test_midget')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.entry_types.register(entry_type2)
          config.for_entry_type(entry_type) do |c|
            c.widget_types.register(widget_type)
          end
          config.for_entry_type(entry_type2) do |c|
            c.widget_types.register(widget_type2)
          end
          config.widget_types.register(widget_type3)
        end
        pageflow.finalize!

        expect(pageflow.config.widget_types.count).to eq 3
      end

      it 'handles duplicate widget types' do
        entry_type = TestEntryType.new(name: 'skulled')
        entry_type2 = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        widget_type = TestWidgetType.new(name: 'test_widget')
        widget_type2 = TestWidgetType.new(name: 'test_fidget')
        widget_type3 = TestWidgetType.new(name: 'test_widget')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.entry_types.register(entry_type2)
          config.for_entry_type(entry_type) do |c|
            c.widget_types.register(widget_type)
          end
          config.for_entry_type(entry_type2) do |c|
            c.widget_types.register(widget_type2)
          end
          config.widget_types.register(widget_type3)
        end
        pageflow.finalize!

        expect(pageflow.config.widget_types.count).to eq 2
      end

      it 'returns all global revision components as well as those for entry types' do
        entry_type = TestEntryType.new
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          config.entry_types.register(entry_type)

          config.for_entry_type(entry_type) do |c|
            c.revision_components.register(:for_entry_type)
          end

          config.revision_components.register(:global)
        end
        pageflow.finalize!

        expect(pageflow.config.revision_components.sort).to eq([:for_entry_type, :global])
      end

      it 'returns all global hooks as well as those for entry types' do
        entry_type = TestEntryType.new
        pageflow = PageflowModule.new
        entry_type_subscriber = spy
        global_subscriber = spy
        pageflow.configure do |config|
          config.entry_types.register(entry_type)

          config.for_entry_type(entry_type) do |c|
            c.hooks.on(:some_event, entry_type_subscriber)
          end

          config.hooks.on(:some_event, global_subscriber)
        end
        pageflow.finalize!

        pageflow.config.hooks.invoke(:some_event)

        expect(entry_type_subscriber).to have_received(:call)
        expect(global_subscriber).to have_received(:call)
      end
    end

    describe '#finalize!' do
      it 'yields config to after_configure blocks' do
        result = false
        pageflow = PageflowModule.new

        pageflow.configure do |config|
          config.features.register('some_stuff')
        end
        pageflow.after_configure do |config|
          result = config.features.enabled?('some_stuff')
        end
        pageflow.finalize!

        expect(result).to eq(true)
      end

      it 'yields config to after_global_configure blocks' do
        result = false
        pageflow = PageflowModule.new

        pageflow.configure do |config|
          config.features.register('some_stuff')
        end
        pageflow.after_global_configure do |config|
          result = config.features.enabled?('some_stuff')
        end
        pageflow.finalize!

        expect(result).to eq(true)
      end

      it 'raises helpful error when trying to enable unknown feature by default' do
        pageflow = PageflowModule.new

        pageflow.configure do |config|
          config.features.enable_by_default('unknown')
          config.features.register('other_stuff')
        end

        expect {
          pageflow.finalize!
        }.to raise_error(/unknown feature/)
      end

      it 'does not raise error when enabling feature by default before registering it' do
        pageflow = PageflowModule.new

        expect {
          pageflow.configure do |config|
            config.features.enable_by_default('some_stuff')
            config.features.register('some_stuff')
          end
        }.not_to raise_error
      end
    end

    describe '#config_for' do
      it 'returns config with enabled features of target' do
        target = double('target', enabled_feature_names: ['some_stuff'])
        pageflow = PageflowModule.new

        pageflow.configure do |config|
          config.features.register('some_stuff')
          config.features.register('other_stuff')
        end

        config_for_target = pageflow.config_for(target)

        expect(config_for_target.features.enabled?('some_stuff')).to be(true)
        expect(config_for_target.features.enabled?('other_stuff')).to be(false)
      end

      it 'yields config with enabled features of target to after_configure blocks' do
        target = double('target', enabled_feature_names: ['some_stuff'])
        pageflow = PageflowModule.new
        result = nil
        result_other = nil

        pageflow.configure do |config|
          config.features.register('some_stuff')
          config.features.register('other_stuff')
        end
        pageflow.after_configure do |config|
          result = config.features.enabled?('some_stuff')
          result_other = config.features.enabled?('other_stuff')
        end
        pageflow.config_for(target)

        expect(result).to be(true)
        expect(result_other).to be(false)
      end

      it 'yields config to entry type specific configure blocks, then after_configure blocks' do
        pageflow = PageflowModule.new
        entry_type = TestEntryType.new(name: 'skulled')
        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])
        calls = []
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |_config|
            calls << 'for_entry_type block'
          end
        end
        pageflow.after_configure do |_config|
          calls << 'after_configure block'
        end
        pageflow.config_for(entry)

        expect(calls).to eq(['for_entry_type block', 'after_configure block'])
      end

      it 'returns config with custom attributes for entry type' do
        phaged_config = Class.new do
          include EntryTypeConfiguration

          attr_accessor :phage_types

          def initialize(*)
            @phage_types = PageTypes.new
            super
          end
        end
        entry_type = TestEntryType.new(name: 'phaged', configuration: phaged_config)
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.phage_types.register(TestPageType.new(name: 'Rainbow'))
          end
        end

        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])
        config_for_target = pageflow.config_for(entry)

        expect(config_for_target.phage_types.names).to include('Rainbow')
      end

      it "doesn't return config with custom attributes for another entry type" do
        phaged_config = Class.new do
          include EntryTypeConfiguration

          attr_accessor :phage_types

          def initialize(*)
            @phage_types = PageTypes.new
            super
          end
        end
        skulled_config = Class.new do
          include EntryTypeConfiguration
        end
        entry_type = TestEntryType.new(name: 'phaged', configuration: phaged_config)
        entry_type2 = TestEntryType.new(name: 'skulled', configuration: skulled_config)
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.phage_types.register(TestPageType.new(name: 'Rainbow'))
          end
          config.entry_types.register(entry_type2)
        end

        entry = double('entry', entry_type: entry_type2, enabled_feature_names: [])
        config_for_target = pageflow.config_for(entry)

        expect(config_for_target.respond_to?(:phage_types)).to be_falsy
      end

      it 'returns values of constant type independent of for_entry_type calls' do
        skulled_config = Class.new do
          include EntryTypeConfiguration
          attr_accessor :data

          def initialize(*)
            super
            @data = 'empty'
          end
        end
        entry_type = TestEntryType.new(name: 'skulled', configuration: skulled_config)
        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
        end
        config_for_target = pageflow.config_for(entry)
        pageflow.configure do |config|
          config.for_entry_type(entry_type) do |c|
            c.data = 'full'
          end
        end
        config_for_target2 = pageflow.config_for(entry)

        expect(config_for_target.class).to eq config_for_target2.class
      end

      it 'returns same config object independent of for_entry_type calls' do
        skulled_config = Class.new do
          include EntryTypeConfiguration
          attr_accessor :data, :other_data

          def initialize(*)
            super
            @data = 'empty'
            @other_data = 'empty'
          end
        end
        entry_type = TestEntryType.new(name: 'skulled', configuration: skulled_config)
        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.data = 'full'
          end
          config.for_entry_type(entry_type) do |c|
            c.other_data = 'fuller'
          end
        end
        config_for_target = pageflow.config_for(entry)

        expect(config_for_target.data).to eq 'full'
        expect(config_for_target.other_data).to eq 'fuller'
      end

      it "doesn't make available all config options inside for_entry_blocks" do
        entry_type = TestEntryType.new(name: 'skulled')
        pageflow = PageflowModule.new
        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.mailer_sender = 'spam@b.ot'
          end
        end

        expect { pageflow.config_for(entry) }.to raise_error(NoMethodError, /mailer_sender/)
      end

      it 'allows registering a file type for an entry type' do
        entry_type = TestEntryType.new(name: 'skulled')
        pageflow = PageflowModule.new
        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 collection_name: 'image_files')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.file_types.register(file_type)
          end
        end
        config_for_target = pageflow.config_for(entry)

        expect(config_for_target.file_types.find_by_model!(Pageflow::ImageFile)).to_not be nil
      end

      it "doesn't make file types available to other entry types" do
        entry_type = TestEntryType.new(name: 'skulled')
        other_entry_type = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        entry = double('entry', entry_type: other_entry_type, enabled_feature_names: [])
        file_type = FileType.new(model: 'Pageflow::ImageFile',
                                 collection_name: 'image_files')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.entry_types.register(other_entry_type)
          config.for_entry_type(entry_type) do |c|
            c.file_types.register(file_type)
          end
        end
        config_for_target = pageflow.config_for(entry)

        expect { config_for_target.file_types.find_by_model!(Pageflow::ImageFile) }.to(
          raise_error FileType::NotFoundError
        )
      end

      it 'allows registering a widget type for an entry type' do
        entry_type = TestEntryType.new(name: 'skulled')
        pageflow = PageflowModule.new
        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])
        widget_type = TestWidgetType.new(name: 'test_widget')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.widget_types.register(widget_type)
          end
        end
        config_for_target = pageflow.config_for(entry)

        expect(config_for_target.widget_types.find_by_name!('test_widget')).to_not be nil
      end

      it "doesn't make widget types available to other entry types" do
        entry_type = TestEntryType.new(name: 'skulled')
        other_entry_type = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        entry = double('entry', entry_type: other_entry_type, enabled_feature_names: [])
        widget_type = TestWidgetType.new(name: 'test_widget')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.entry_types.register(other_entry_type)
          config.for_entry_type(entry_type) do |c|
            c.widget_types.register(widget_type)
          end
        end
        config_for_target = pageflow.config_for(entry)

        expect { config_for_target.widget_types.find_by_name!('test_widget') }.to(
          raise_error WidgetType::NotFoundError
        )
      end

      it 'allows using for_entry_type inside features' do
        pageflow = PageflowModule.new
        widget_type = TestWidgetType.new(name: 'test_widget')
        entry_type = TestEntryType.new(name: 'skulled')
        other_entry_type = TestEntryType.new(name: 'phaged')
        entry_with_feature = double('entry',
                                    entry_type: entry_type,
                                    enabled_feature_names: ['some-feature'])
        entry_without_feature = double('entry',
                                       entry_type: entry_type,
                                       enabled_feature_names: [])
        entry_with_feature_of_other_type = double('entry',
                                                  entry_type: other_entry_type,
                                                  enabled_feature_names: ['some-feature'])

        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.entry_types.register(other_entry_type)

          config.features.register 'some-feature' do |f|
            f.for_entry_type(entry_type) do |c|
              c.widget_types.register(widget_type)
            end
          end
        end

        expect(pageflow.config_for(entry_with_feature).widget_types)
          .to include(widget_type)
        expect(pageflow.config_for(entry_without_feature).widget_types)
          .not_to include(widget_type)
        expect(pageflow.config_for(entry_with_feature_of_other_type).widget_types)
          .not_to include(widget_type)
      end

      it 'allows registering feature blocks in for_entry_type blocks' do
        pageflow = PageflowModule.new
        widget_type = TestWidgetType.new(name: 'test_widget')
        entry_type = TestEntryType.new(name: 'skulled')
        entry_with_feature = double('entry',
                                    entry_type: entry_type,
                                    enabled_feature_names: ['some-feature'])
        entry_without_feature = double('entry',
                                       entry_type: entry_type,
                                       enabled_feature_names: [])

        pageflow.configure do |config|
          config.entry_types.register(entry_type)

          config.for_entry_type(entry_type) do |c|
            c.features.register 'some-feature' do |f|
              f.widget_types.register(widget_type)
            end
          end
        end

        expect(pageflow.config_for(entry_with_feature).widget_types)
          .to include(widget_type)
        expect(pageflow.config_for(entry_without_feature).widget_types)
          .not_to include(widget_type)
      end

      it 'allows using entry type specific config in feature block in for_entry_type blocks' do
        pageflow = PageflowModule.new
        skulled_config = Class.new do
          include EntryTypeConfiguration
          attr_accessor :data
        end
        entry_type = TestEntryType.new(name: 'skulled',
                                       configuration: skulled_config)
        entry_with_feature = double('entry',
                                    entry_type: entry_type,
                                    enabled_feature_names: ['some-feature'])
        entry_without_feature = double('entry',
                                       entry_type: entry_type,
                                       enabled_feature_names: [])

        pageflow.configure do |config|
          config.entry_types.register(entry_type)

          config.for_entry_type(entry_type) do |c|
            c.features.register 'some-feature' do |f|
              f.data = 'value'
            end
          end
        end

        expect(pageflow.config_for(entry_with_feature).data).to eq('value')
        expect(pageflow.config_for(entry_without_feature).data).to be_nil
      end

      it 'allows using entry type specific config in feature object registered ' \
         'in for_entry_type blocks' do
        pageflow = PageflowModule.new
        skulled_config = Class.new do
          include EntryTypeConfiguration
          attr_accessor :data
        end
        entry_type = TestEntryType.new(name: 'skulled',
                                       configuration: skulled_config)
        entry_with_feature = double('entry',
                                    entry_type: entry_type,
                                    enabled_feature_names: ['some-feature'])
        entry_without_feature = double('entry',
                                       entry_type: entry_type,
                                       enabled_feature_names: [])

        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.features.register(Feature.new('some-feature') do |f|
                                  f.data = 'value'
                                end)
          end
        end

        expect(pageflow.config_for(entry_with_feature).data).to eq('value')
        expect(pageflow.config_for(entry_without_feature).data).to be_nil
      end

      it 'preserves name_translation_key for features registered in for_entry_type blocks' do
        pageflow = PageflowModule.new
        entry_type = TestEntryType.new(name: 'skulled')
        entry = double('entry',
                       entry_type: entry_type,
                       enabled_feature_names: ['some-feature'])
        feature = Feature.new('some-feature', name_translation_key: 'something_else')
        pageflow.configure do |config|
          config.entry_types.register(entry_type)
          config.for_entry_type(entry_type) do |c|
            c.features.register(feature)
          end
        end

        name_translation_keys = pageflow.config_for(entry).features.map(&:name_translation_key)

        expect(name_translation_keys).to include('something_else')
      end

      it 'allows registering help entries in for_entry_type block' do
        pageflow = PageflowModule.new
        phaged_entry_type = TestEntryType.new(name: 'phaged')
        skulled_entry_type = TestEntryType.new(name: 'skulled')
        pageflow.configure do |config|
          config.entry_types.register(phaged_entry_type)
          config.entry_types.register(skulled_entry_type)

          config.for_entry_type(phaged_entry_type) do |c|
            c.help_entries.register('phaged_entry')
          end
        end
        phaged_entry = double('entry', entry_type: phaged_entry_type, enabled_feature_names: [])
        skulled_entry = double('entry', entry_type: skulled_entry_type, enabled_feature_names: [])

        phaged_help_entry_names = pageflow.config_for(phaged_entry).help_entries.map(&:name)
        skulled_help_entry_names = pageflow.config_for(skulled_entry).help_entries.map(&:name)

        expect(phaged_help_entry_names).to include('phaged_entry')
        expect(skulled_help_entry_names).not_to include('phaged_entry')
      end

      it 'allows registering themes in for_entry_type block' do
        pageflow = PageflowModule.new
        phaged_entry_type = TestEntryType.new(name: 'phaged')
        skulled_entry_type = TestEntryType.new(name: 'skulled')
        pageflow.configure do |config|
          config.entry_types.register(phaged_entry_type)
          config.entry_types.register(skulled_entry_type)

          config.for_entry_type(phaged_entry_type) do |c|
            c.themes.register(:phaged_theme)
          end
        end
        phaged_entry = double('entry', entry_type: phaged_entry_type, enabled_feature_names: [])
        skulled_entry = double('entry', entry_type: skulled_entry_type, enabled_feature_names: [])

        phaged_help_entry_names = pageflow.config_for(phaged_entry).themes.map(&:name)
        skulled_help_entry_names = pageflow.config_for(skulled_entry).themes.map(&:name)

        expect(phaged_help_entry_names).to include('phaged_theme')
        expect(skulled_help_entry_names).not_to include('phaged_theme')
      end

      it 'allows calling plugin method inside for_entry_type block' do
        pageflow = PageflowModule.new
        entry_type = TestEntryType.new(name: 'phaged')
        plugin = Class.new {
          def configure(config)
            config.help_entries.register('phaged_entry')
          end
        }.new
        pageflow.configure do |config|
          config.entry_types.register(entry_type)

          config.for_entry_type(entry_type) do |c|
            c.plugin(plugin)
          end
        end
        entry = double('entry', entry_type: entry_type, enabled_feature_names: [])

        help_entry_names = pageflow.config_for(entry).help_entries.map(&:name)

        expect(help_entry_names).to include('phaged_entry')
      end
    end
  end
end
