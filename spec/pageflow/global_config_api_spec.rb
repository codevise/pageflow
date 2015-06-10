require 'rspec'

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
    end
  end
end
