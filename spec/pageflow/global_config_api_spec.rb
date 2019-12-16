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

      it 'returns config with custom attributes for entry type' do
        phaged_config = Class.new do
          include Pageflow::Configuration::EntryTypeConfiguration

          attr_accessor :phage_types

          def initialize(config)
            @phage_types = PageTypes.new
            super(config)
          end
        end
        entry_type = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          TestEntryType.register(config, name: 'phaged', configuration: phaged_config)
          config.for_entry_type(entry_type) do |c|
            c.phage_types.register(TestPageType.new(name: 'Rainbow'))
          end
        end

        entry = double('entry', type_name: 'phaged', enabled_feature_names: [])
        config_for_target = pageflow.config_for(entry)

        expect(config_for_target.phage_types.names).to include('Rainbow')
      end

      it "doesn't return config with custom attributes for another entry type" do
        phaged_config = Class.new do
          include Pageflow::Configuration::EntryTypeConfiguration

          attr_accessor :phage_types

          def initialize(config)
            @phage_types = PageTypes.new
            super(config)
          end
        end
        skulled_config = Class.new do
          include Pageflow::Configuration::EntryTypeConfiguration

          def initialize(config)
            super(config)
          end
        end
        entry_type = TestEntryType.new(name: 'phaged')
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          TestEntryType.register(config, name: 'phaged', configuration: phaged_config)
          config.for_entry_type(entry_type) do |c|
            c.phage_types.register(TestPageType.new(name: 'Rainbow'))
          end
          TestEntryType.register(config,
                                 name: 'skulled',
                                 configuration: skulled_config)
        end

        entry = double('entry', type_name: 'skulled', enabled_feature_names: [])
        config_for_target = pageflow.config_for(entry)

        expect(config_for_target.respond_to?(:phage_types)).to be_falsy
      end

      it 'returns values of constant type independent of for_entry_type calls' do
        entry_type = TestEntryType.new(name: 'skulled')
        entry = double('entry', type_name: 'skulled', enabled_feature_names: [])
        skulled_config = Class.new do
          include Pageflow::Configuration::EntryTypeConfiguration
          attr_accessor :data

          def initialize(config)
            super(config)
            @data = 'empty'
          end
        end
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          TestEntryType.register(config,
                                 name: 'skulled',
                                 configuration: skulled_config)
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
        entry_type = TestEntryType.new(name: 'skulled')
        entry = double('entry', type_name: 'skulled', enabled_feature_names: [])
        skulled_config = Class.new do
          include Pageflow::Configuration::EntryTypeConfiguration
          attr_accessor :data, :other_data

          def initialize(config)
            super(config)
            @data = 'empty'
            @other_data = 'empty'
          end
        end
        pageflow = PageflowModule.new
        pageflow.configure do |config|
          TestEntryType.register(config,
                                 name: 'skulled',
                                 configuration: skulled_config)
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
    end
  end
end
