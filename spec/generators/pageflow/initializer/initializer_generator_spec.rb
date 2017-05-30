require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/initializer/initializer_generator'

module Pageflow
  module Generators
    describe InitializerGenerator, type: :generator do
      let(:initializer) { file('config/initializers/pageflow.rb') }

      before do
        run_generator
      end

      it "generates 'config/initializers/pageflow.rb'" do
        expect(initializer).to exist
      end

      it 'registers the built-in classic player controls' do
        expect(initializer)
          .to contain('config.widget_types.register(Pageflow::BuiltInWidgetType.classic_player_controls')
      end

      it 'registers the built-in slim player controls' do
        expect(initializer)
          .to contain('config.widget_types.register(Pageflow::BuiltInWidgetType.slim_player_controls')
      end

      it 'registers the built-in navigation widget type' do
        expect(initializer)
          .to contain('config.widget_types.register(Pageflow::BuiltInWidgetType.navigation')
      end

      it 'registers the built-in mobile_navigation widget type' do
        expect(initializer)
          .to contain('config.widget_types.register(Pageflow::BuiltInWidgetType.mobile_navigation')
      end
    end
  end
end
