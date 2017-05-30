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
          .to contain(/default_user_password\('\w{12}'\)/)
      end
    end
  end
end
