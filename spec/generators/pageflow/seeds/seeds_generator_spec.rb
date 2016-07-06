require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/seeds/seeds_generator'

module Pageflow
  module Generators
    describe SeedsGenerator, type: :generator do
      it "generates 'db/seeds.rb'" do
        run_generator
        expect(file('db/seeds.rb')).to exist
      end
    end
  end
end
