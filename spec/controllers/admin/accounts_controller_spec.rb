require 'spec_helper'

module Admin
  describe AccountsController do
    describe '#create' do
      it 'creates nested default_theming with given theme' do
        theme = create(:theme)

        sign_in(create(:user, :admin))
        post(:create, :account => {:default_theming_attributes => {:theme_id => theme.id}})

        expect(Pageflow::Account.last.default_theming.theme).to eq(theme)
      end
    end

    describe '#update' do
      it 'updates nested default_theming' do
        theming = create(:theming)
        account = create(:account, :default_theming => theming)
        other_theme = create(:theme)

        sign_in(create(:user, :admin))
        put(:update, :id => account.id, :account => {:default_theming_attributes => {:theme_id => other_theme.id}})

        expect(theming.reload.theme).to eq(other_theme)
      end
    end

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
