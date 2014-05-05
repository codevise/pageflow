require 'spec_helper'

describe Admin::MembershipsController do
  describe '#create' do
    describe 'as admin' do
      it 'does not allow to add user of other account to entry' do
        user = create(:user, :editor)
        entry = create(:entry)

        sign_in(create(:user, :admin))

        expect {
          post :create, :entry_id => entry, :membership => {:user_id => user}
        }.not_to change { entry.memberships.count }
      end

      it 'does not allow to add entry of other account to user' do
        user = create(:user, :editor)
        entry = create(:entry)

        sign_in(create(:user, :admin))

        expect {
          post :create, :user_id => user, :membership => {:entry_id => entry}
        }.not_to change { user.memberships.count }
      end
    end

    describe 'as account admin' do
      it 'does not allow to add user to entry in other account' do
        account = create(:account)
        user = create(:user, :editor, :account => account)
        entry = create(:entry, :account => account)

        sign_in(create(:user, :account_manager))

        expect {
          post :create, :entry_id => entry, :membership => {:user_id => user}
        }.not_to change { entry.memberships.count }
      end

      it 'does not allow to add entry to user in other account' do
        account = create(:account)
        user = create(:user, :editor, :account => account)
        entry = create(:entry, :account => account)

        sign_in(create(:user, :account_manager))

        expect {
          post :create, :user_id => user, :membership => {:entry_id => entry}
        }.not_to change { user.memberships.count }
      end
    end
  end
end
