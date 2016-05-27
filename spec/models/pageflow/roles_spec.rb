require 'spec_helper'

module Pageflow
  describe Roles do
    describe '.at_least' do
      it 'returns list of equal or stronger roles' do
        result = Roles.at_least(:publisher)

        expect(result).to eq(%w(publisher manager))
      end
    end
  end
end
