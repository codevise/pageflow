require 'spec_helper'

module Pageflow
  describe Roles do
    describe '.at_least' do
      it 'returns list of equal or stronger roles' do
        result = Roles.at_least(:publisher)

        expect(result).to eq(%w(publisher manager))
      end
    end

    describe '.highest_role_among(memberships)' do
      it 'returns the highest role among a given collection of memberships' do
        user = create(:user)
        create(:membership, user: user, role: :previewer)
        create(:membership, user: user, role: :editor)
        create(:membership, user: user, role: :publisher)
        create(:membership, user: user, role: :member)

        expect(Roles.highest_role_among(user.memberships)).to eq(:publisher)
      end
    end
  end
end
