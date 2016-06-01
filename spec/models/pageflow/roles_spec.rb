require 'spec_helper'

module Pageflow
  describe Roles do
    describe '.at_least' do
      it 'returns list of equal or stronger roles' do
        result = Roles.at_least(:publisher)

        expect(result).to eq(%w(publisher manager))
      end
    end

    describe '.high' do
      it 'returns role on account when higher' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry = create(:entry, with_publisher: user, account: account)

        expect(Roles.high(user, entry)).to eq(:manager)
      end

      it 'returns role on entry when higher' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry = create(:entry, with_previewer: user, account: account)

        expect(Roles.high(user, entry)).to eq(:previewer)
      end

      it 'returns correct role when account and entry role are equal' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, with_editor: user, account: account)

        expect(Roles.high(user, entry)).to eq(:editor)
      end

      it 'returns correct role when only account role exists' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry = create(:entry, account: account)

        expect(Roles.high(user, entry)).to eq(:member)
      end
    end
  end
end
