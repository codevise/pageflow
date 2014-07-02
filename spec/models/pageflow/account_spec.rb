require 'spec_helper'

module Pageflow
  describe Account do
    describe '#build_default_theming' do
      it 'sets default theming to new theming' do
        account = create(:account)

        theming = account.build_default_theming

        expect(account.default_theming).to eq(theming)
      end

      it 'initializes account of new theming to self' do
        account = create(:account)

        theming = account.build_default_theming

        expect(theming.account).to eq(account)
      end
    end
  end
end
