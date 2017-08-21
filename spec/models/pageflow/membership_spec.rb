require 'spec_helper'

module Pageflow
  describe Membership do
    describe 'users_count callback' do
      it 'updates account attribute upon Membership.create on account' do
        account = create(:account)

        expect do
          create(:membership, entity: account)
        end.to change { account.users_count }.by(1)
      end

      it 'updates entry attribute upon Membership.create on entry' do
        entry = create(:entry)

        expect do
          create(:membership, entity: entry)
        end.to change { entry.users_count }.by(1)
      end

      it 'updates account attribute upon Membership.destroy on account' do
        account = create(:account)
        membership = create(:membership, entity: account)

        expect do
          membership.destroy
        end.to change { account.users_count }.by(-1)
      end

      it 'updates entry attribute upon Membership.destroy on entry' do
        entry = create(:entry)
        membership = create(:membership, entity: entry)

        expect do
          membership.destroy
        end.to change { entry.users_count }.by(-1)
      end

      it 'accepts second account membership if allow_multiaccount_users is '\
         'true' do
        pageflow_configure do |config|
          config.allow_multiaccount_users = true
        end

        account_member = create(:user, :member, on: create(:account))

        expect(Membership
                 .new(user: account_member,
                      role: :member,
                      entity: create(:account))).to be_valid
      end

      it 'rejects second account membership if allow_multiaccount_users is '\
         'false' do
        pageflow_configure do |config|
          config.allow_multiaccount_users = false
        end

        account_member = create(:user, :member, on: create(:account))

        expect(Membership
                 .new(user: account_member,
                      role: :member,
                      entity: create(:account))).to be_invalid
      end
    end
  end
end
