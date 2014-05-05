require 'spec_helper'

module Admin
  describe AccountsController do
    describe '#destroy' do
      it 'allows to destroy empty account' do
        account = create(:account)

        sign_in(create(:user, :admin))

        expect {
          delete :destroy, :id => account
        }.to change { Pageflow::Account.count }
      end

      it 'does not allow to destroy account with user' do
        account = create(:account)
        create(:user, :account => account)

        sign_in(create(:user, :admin))

        expect {
          delete :destroy, :id => account
        }.not_to change { Pageflow::Account.count }
      end

      it 'does not allow to destroy account with entry' do
        account = create(:account)
        create(:entry, :account => account)

        sign_in(create(:user, :admin))

        expect {
          delete :destroy, :id => account
        }.not_to change { Pageflow::Account.count }
      end
    end
  end
end
