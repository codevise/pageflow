require 'spec_helper'

module Pageflow
  describe Membership do
    describe 'users_count callback' do
      it 'updates account attribute upon Membership.create on account' do
        account = create(:account)

        expect {
          create(:membership, entity: account)
        }.to change { account.users_count }.by(1)
      end

      it 'updates entry attribute upon Membership.create on entry' do
        entry = create(:entry)

        expect {
          create(:membership, entity: entry)
        }.to change { entry.users_count }.by(1)
      end

      it 'updates account attribute upon Membership.destroy on account' do
        account = create(:account)
        membership = create(:membership, entity: account)

        expect {
          membership.destroy
        }.to change { account.users_count }.by(-1)
      end

      it 'updates entry attribute upon Membership.destroy on entry' do
        entry = create(:entry)
        membership = create(:membership, entity: entry)

        expect {
          membership.destroy
        }.to change { entry.users_count }.by(-1)
      end
    end
  end
end
