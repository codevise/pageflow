require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/seeds/seeds_generator'

module Pageflow
  module Generators
    describe SeedsGenerator, type: :generator do
      let(:seeds) { file('db/seeds.rb') }

      before do
        run_generator
      end

      it "generates 'db/seeds.rb'" do
        expect(seeds).to exist
      end

      it 'generates a random password' do
        expect(seeds)
          .to_not contain('!Pass123')
      end
    end
  end
end
