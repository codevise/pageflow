require 'spec_helper'

module Admin
  describe AccountsController do
    describe '#create' do
      it 'creates nested default_theming' do
        Pageflow.config.themes.register(:custom)

        sign_in(create(:user, :admin))
        post(:create, :account => {
               :default_theming_attributes => {
                 :theme_name => 'custom',
                 :imprint_link_url => 'http://example.com/new'
               }
             })

        expect(Pageflow::Account.last.default_theming.theme_name).to eq('custom')
      end
    end

    describe '#update' do
      it 'updates nested default_theming' do
        Pageflow.config.themes.register(:custom)
        theming = create(:theming)
        account = create(:account, :default_theming => theming)

        sign_in(create(:user, :admin))
        put(:update, :id => account.id, :account => {
              :default_theming_attributes => {
                :theme_name => 'custom',
                :imprint_link_url => 'http://example.com/new'
              }
            })

        expect(theming.reload.theme_name).to eq('custom')
        expect(theming.imprint_link_url).to eq('http://example.com/new')
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
