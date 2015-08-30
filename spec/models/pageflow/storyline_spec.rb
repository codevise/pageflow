require 'spec_helper'

module Pageflow
  describe Storyline do
    describe '#configuration=' do
      it 'stores arbitrary options' do
        storyline = build(:storyline)

        storyline.configuration = {'some' => 'option'}

        expect(storyline.configuration['some']).to eq('option')
      end
    end
  end
end
