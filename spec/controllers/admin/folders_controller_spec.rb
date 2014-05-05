require 'spec_helper'

describe Admin::FoldersController do
  describe '#create' do
    describe 'as admin' do
      it 'allows to add folder for any account' do
        account = create(:account)

        sign_in(create(:user, :admin))

        expect {
          post :create, :folder => attributes_for(:folder, :account_id => account)
        }.to change { account.folders.count }
      end
    end

    describe 'as account admin' do
      it 'does not allow to add folder to other account' do
        account = create(:account)

        sign_in(create(:user, :account_manager))

        expect {
          post :create, :folder => attributes_for(:folder, :account_id => account)
        }.not_to change { account.folders.count }
      end

      it 'allows to add folder for own account' do
        user = create(:user, :account_manager)

        sign_in(user)

        expect {
          post :create, :folder => attributes_for(:folder, :account_id => user.account)
        }.to change { user.account.folders.count }
      end
    end

    describe 'as editor' do
      it 'does not allow to add folder for own account' do
        user = create(:user, :editor)

        sign_in(user)

        expect {
          post :create, :folder => attributes_for(:folder, :account_id => user.account)
        }.not_to change { user.account.folders.count }
      end
    end
  end

  describe '#update' do
    describe 'as admin' do
      it 'allows to change name of folder for any account' do
        folder = create(:folder)

        sign_in(create(:user, :admin))
        patch :update, :id => folder, :folder => {:name => 'changed'}

        expect(folder.reload.name).to eq('changed')
      end

      it 'does not allow to change account of folder' do
        folder = create(:folder)
        other_account = create(:account)

        sign_in(create(:user, :admin))
        patch :update, :id => folder, :folder => {:account_id => other_account}

        expect(folder.reload.account).not_to eq(other_account)
      end
    end

    describe 'as account admin' do
      it 'does not allow to change name of folder of other account' do
        folder = create(:folder, :name => 'old')

        sign_in(create(:user, :account_manager))
        patch :update, :id => folder, :folder => {:name => 'changed'}

        expect(folder.reload.name).to eq('old')
      end

      it 'allows to change name of folder of own account' do
        user = create(:user, :account_manager)
        folder = create(:folder, :name => 'old', :account => user.account)

        sign_in(user)
        patch :update, :id => folder, :folder => {:name => 'changed'}

        expect(folder.reload.name).to eq('changed')
      end
    end

    describe 'as editor' do
      it 'does not allow to change name of folder of own account' do
        user = create(:user, :editor)
        folder = create(:folder, :name => 'old', :account => user.account)

        sign_in(user)
        patch :update, :id => folder, :folder => {:name => 'changed'}

        expect(folder.reload.name).to eq('old')
      end
    end
  end

  describe '#destroy' do
    describe 'as admin' do
      it 'allows to destroy folder of any account' do
        folder = create(:folder)

        sign_in(create(:user, :admin))

        expect {
          delete :destroy, :id => folder
        }.to change { Pageflow::Folder.count }
      end
    end

    describe 'as account admin' do
      it 'does not allow to destroy folder of other account' do
        folder = create(:folder)

        sign_in(create(:user, :account_manager))

        expect {
          delete :destroy, :id => folder
        }.not_to change { Pageflow::Folder.count }
      end

      it 'allows to destroy folder of own account' do
        user = create(:user, :account_manager)
        folder = create(:folder, :account => user.account)

        sign_in(user)

        expect {
          delete :destroy, :id => folder
        }.to change { Pageflow::Folder.count }
      end
    end

    describe 'as editor' do
      it 'does not allow to destroy folder of own account' do
        user = create(:user, :editor)
        folder = create(:folder, :account => user.account)

        sign_in(user)

        expect {
          delete :destroy, :id => folder
        }.not_to change { user.account.folders.count }
      end
    end
  end
end
