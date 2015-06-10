require 'rspec'

module Pageflow
  describe Features do
    describe '#enable' do
      it 'calls #enable block of matching features' do
        features = Features.new
        config = Configuration.new

        expect { |probe|
          features.register(Feature.new('advanced_stuff', &probe))
          features.enable(['advanced_stuff'], config)
        }.to yield_with_args(config)
      end

      it 'does not call #enable block of non matching features' do
        features = Features.new
        config = Configuration.new

        expect { |probe|
          features.register(Feature.new('advanced_stuff', &probe))
          features.register(Feature.new('other'))
          features.enable(['other'], config)
        }.not_to yield_control
      end

      it 'calls #enable block of matching block features' do
        features = Features.new
        config = Configuration.new

        expect { |probe|
          features.register('advanced_stuff', &probe)
          features.enable(['advanced_stuff'], config)
        }.to yield_with_args(config)
      end

      it 'ignores features without enable block' do
        features = Features.new
        config = Configuration.new

        expect {
          features.register('advanced_stuff')
          features.enable(['advanced_stuff'], config)
        }.not_to raise_error
      end

      it 'raises helpful error when feature is not registered' do
        features = Features.new
        config = Configuration.new

        expect {
          features.enable(['unknown'], config)
        }.to raise_error(/unknown feature/)
      end
    end

    describe '#enable_all' do
      it 'calls #enable block of all features' do
        features = Features.new
        config = Configuration.new

        expect { |probe|
          features.register(Feature.new('advanced_stuff', &probe))
          features.enable_all(config)
        }.to yield_with_args(config)
      end
    end

    describe '#register' do
      it 'raises helpful error when feature is already registered' do
        features = Features.new
        config = Configuration.new

        expect {
          features.register('some_stuff')
          features.register('some_stuff')
        }.to raise_error(/already registered/)
      end
    end

    describe '#enabled?' do
      it 'returns true if a feature has been applied' do
        features = Features.new
        config = Configuration.new

        features.register('some_stuff')
        features.enable(['some_stuff'], config)

        expect(features.enabled?('some_stuff')).to be(true)
      end

      it 'returns false if a feature has not been applied' do
        features = Features.new
        config = Configuration.new

        features.register('some_stuff')

        expect(features.enabled?('some_stuff')).to be(false)
      end
    end
  end
end
