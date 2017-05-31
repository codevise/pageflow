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

      it 'registers the built-in widget types plugin' do
        expect(initializer)
          .to contain('config.plugin(Pageflow.built_in_widget_types_plugin')
      end
    end
  end
end
