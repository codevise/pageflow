require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/cancan/cancan_generator'

module Pageflow
  module Generators
    describe CancanGenerator, type: :generator do
      it "generates 'app/models/ability.rb'" do
        run_generator
        expect(file('app/models/ability.rb')).to exist
      end
    end
  end
end
