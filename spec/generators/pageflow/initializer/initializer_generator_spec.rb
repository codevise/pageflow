require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/initializer/initializer_generator'

module Pageflow
  module Generators
    describe InitializerGenerator, type: :generator do
      it "generates 'config/initializers/pageflow.rb'" do
        run_generator
        expect(file('config/initializers/pageflow.rb')).to exist
      end
    end
  end
end
