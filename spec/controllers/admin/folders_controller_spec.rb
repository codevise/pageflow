require 'spec_helper'

describe Admin::FoldersController do
  describe '#create' do
    describe 'as admin' do
      it 'allows to add folder for any account' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          post :create, params: {folder: attributes_for(:folder, account_id: account)}
        end.to change { account.folders.count }
      end
    end

    describe 'as account publisher' do
      it 'does not allow to add folder to other account' do
        account = create(:account)
        other_account = create(:account)
        sign_in(create(:user, :publisher, on: other_account), scope: :user)

        expect do
          post :create, params: {folder: attributes_for(:folder, account_id: account)}
        end.not_to change { account.folders.count }
      end

      it 'allows to add folder for own account' do
        account = create(:account)
        sign_in(create(:user, :publisher, on: account), scope: :user)

        expect do
          post :create, params: {folder: attributes_for(:folder, account_id: account)}
        end.to change { account.folders.count }
      end

      it 'allows to add folder for account when multiple accounts are present' do
        account = create(:account)
        other_account = create(:account)
        user = create(:user, :publisher, on: account)
        create(:membership, user: user, entity: other_account, role: :publisher)
        sign_in(user, scope: :user)

        expect do
          post :create, params: {folder: attributes_for(:folder, account_id: other_account)}
        end.to change { other_account.folders.count }
      end
    end

    describe 'as entry manager/account editor of entry on account' do
      it 'does not allow to add folder for entry/own account' do
        entry = create(:entry)
        user = create(:user)
        create(:membership, user: user, entity: entry.account, role: :editor)
        create(:membership, user: user, entity: entry, role: :manager)
        sign_in(user, scope: :user)

        expect do
          post :create, params: {folder: attributes_for(:folder, account_id: entry.account)}
        end.not_to change { entry.account.folders.count }
      end
    end
  end

  describe '#update' do
    describe 'as admin' do
      it 'allows to change name of folder for any account' do
        folder = create(:folder)

        sign_in(create(:user, :admin), scope: :user)
        patch :update, params: {id: folder, folder: {name: 'changed'}}

        expect(folder.reload.name).to eq('changed')
      end

      it 'does not allow to change account of folder' do
        folder = create(:folder)
        other_account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        patch :update, params: {id: folder, folder: {account_id: other_account}}

        expect(folder.reload.account).not_to eq(other_account)
      end
    end

    describe 'as account publisher' do
      it 'does not allow to change name of folder of other account' do
        folder = create(:folder, name: 'old')
        other_account = create(:account)
        sign_in(create(:user, :publisher, on: other_account), scope: :user)
        patch :update, params: {id: folder, folder: {name: 'changed'}}

        expect(folder.reload.name).to eq('old')
      end

      it 'allows to change name of folder of own account' do
        folder = create(:folder, name: 'old')
        user = create(:user, :publisher, on: folder.account)

        sign_in(user, scope: :user)
        patch :update, params: {id: folder, folder: {name: 'changed'}}

        expect(folder.reload.name).to eq('changed')
      end
    end

    describe 'as entry manager/account editor of entry on account' do
      it 'does not allow to change name of folder of entry account' do
        entry = create(:entry)
        user = create(:user)
        create(:membership, user: user, entity: entry.account, role: :editor)
        create(:membership, user: user, entity: entry, role: :manager)
        folder = create(:folder, name: 'old', account: entry.account)

        sign_in(user, scope: :user)
        patch :update, params: {id: folder, folder: {name: 'changed'}}

        expect(folder.reload.name).to eq('old')
      end
    end
  end

  describe '#destroy' do
    describe 'as admin' do
      it 'allows to destroy folder of any account' do
        folder = create(:folder)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          delete :destroy, params: {id: folder}
        end.to change { Pageflow::Folder.count }
      end
    end

    describe 'as account publisher' do
      it 'does not allow to destroy folder of other account' do
        folder = create(:folder)
        other_account = create(:account)

        sign_in(create(:user, :publisher, on: other_account), scope: :user)

        expect do
          delete :destroy, params: {id: folder}
        end.not_to change { Pageflow::Folder.count }
      end

      it 'allows to destroy folder of own account' do
        folder = create(:folder)
        user = create(:user, :publisher, on: folder.account)

        sign_in(user, scope: :user)

        expect do
          delete :destroy, params: {id: folder}
        end.to change { Pageflow::Folder.count }
      end
    end

    describe 'as entry manager/account editor of entry on account' do
      it 'does not allow to destroy folder of entry account' do
        entry = create(:entry)
        user = create(:user)
        create(:membership, user: user, entity: entry.account, role: :editor)
        create(:membership, user: user, entity: entry, role: :manager)
        folder = create(:folder, account: entry.account)

        sign_in(user, scope: :user)

        expect do
          delete :destroy, params: {id: folder}
        end.not_to change { Pageflow::Folder.count }
      end
    end
  end
end
