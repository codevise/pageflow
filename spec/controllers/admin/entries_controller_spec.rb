require 'spec_helper'

describe Admin::EntriesController do
  describe '#create' do
    it 'does not allow account manager to create entries for other account' do
      account = create(:account)

      sign_in(create(:user, :account_manager))

      expect {
        post :create, :entry => attributes_for(:entry, :account_id => account)
      }.not_to change { account.entries.count }
    end

    it 'does not allow account manager to create entries with custom theming' do
      theming = create(:theming)

      sign_in(create(:user, :account_manager))

      post :create, :entry => attributes_for(:entry, :theming_id => theming)
      entry = Pageflow::Entry.last

      expect(entry.theming).to eq(entry.account.default_theming)
    end

    it 'allows account manager to create entries for own account' do
      account = create(:account)

      sign_in(create(:user, :account_manager, :account => account))

      expect {
        post :create, :entry => attributes_for(:entry)
      }.to change { account.entries.count }
    end

    it 'allows admin to set user account' do
      account = create(:account)

      sign_in(create(:user, :admin))

      expect {
        post :create, :entry => attributes_for(:entry, :account_id => account)
      }.to change { account.entries.count }
    end

    it 'allows admin to create entries with custom theming' do
      theming = create(:theming)

      sign_in(create(:user, :admin))

      post :create, :entry => attributes_for(:entry, :theming_id => theming)
      entry = Pageflow::Entry.last

      expect(entry.theming).to eq(theming)
    end

    it 'sets entry theming to default theming of account' do
      account = create(:account)

      sign_in(create(:user, :admin))
      post :create, :entry => attributes_for(:entry, :account_id => account)

      expect(Pageflow::Entry.last.theming).to eq(account.default_theming)
    end
  end

  describe '#update' do
    it 'does not allow account manager to change account' do
      account = create(:account)
      other_account = create(:account)
      entry = create(:entry, :account => account)

      sign_in(create(:user, :account_manager, :account => account))
      patch :update, :id => entry, :entry => {:account_id => other_account}

      expect(entry.reload.account).to eq(account)
    end

    it 'allows admin to change account' do
      account = create(:account)
      other_account = create(:account)
      entry = create(:entry, :account => account)

      sign_in(create(:user, :admin))
      patch :update, :id => entry, :entry => {:account_id => other_account}

      expect(entry.reload.account).to eq(other_account)
    end

    it 'does not allow account manager to change theming' do
      theming = create(:theming)
      other_theming = create(:theming)
      entry = create(:entry, :theming => theming)

      sign_in(create(:user, :account_manager, :account => entry.account))
      patch :update, :id => entry, :entry => {:theming_id => other_theming}

      expect(entry.reload.theming).to eq(theming)
    end

    it 'allows admin to change theming' do
      theming = create(:theming)
      other_theming = create(:theming)
      entry = create(:entry, :theming => theming)

      sign_in(create(:user, :admin))
      patch :update, :id => entry, :entry => {:theming_id => other_theming}

      expect(entry.reload.theming).to eq(other_theming)
    end

    it 'does not allow editor to change folder' do
      user = create(:user, :editor)
      folder = create(:folder, :account => user.account)
      entry = create(:entry, :with_member => user, :account => user.account)

      sign_in(user)
      patch :update, :id => entry, :entry => {:folder_id => folder}

      expect(entry.reload.folder).to eq(nil)
    end

    it 'allows account manager to change folder of entry of own account' do
      user = create(:user, :account_manager)
      folder = create(:folder, :account => user.account)
      entry = create(:entry, :account => user.account)

      sign_in(user)
      patch :update, :id => entry, :entry => {:folder_id => folder}

      expect(entry.reload.folder).to eq(folder)
    end

    it 'does not allow account manager to change folder of entry of other account' do
      user = create(:user, :account_manager)
      folder = create(:folder)
      entry = create(:entry, :account => folder.account)

      sign_in(user)
      patch :update, :id => entry, :entry => {:folder_id => folder}

      expect(entry.reload.folder).to eq(nil)
    end

    it 'allows admin to change folder of entry of any account' do
      user = create(:user, :admin)
      folder = create(:folder)
      entry = create(:entry, :account => folder.account)

      sign_in(user)
      patch :update, :id => entry, :entry => {:folder_id => folder}

      expect(entry.reload.folder).to eq(folder)
    end
  end

  describe '#preview' do
    it 'responds redirects to draft revision' do
      user = create(:user)
      entry = create(:entry, :with_member => user)

      sign_in(user)
      get(:preview, :id => entry)

      expect(response).to redirect_to("/revisions/#{entry.draft.id}")
    end

    it 'requires the signed in user to be member of the parent entry' do
      user = create(:user)
      entry = create(:entry)

      sign_in(user)
      get(:preview, :id => entry)

      expect(response).to redirect_to(admin_root_path)
    end
  end

  describe '#snapshot' do
    it 'does not allow account manager to snapshot entries of other account' do
      account = create(:account)
      entry = create(:entry)

      sign_in(create(:user, :account_manager))

      expect {
        post(:snapshot, :id => entry.id)
      }.not_to change { entry.revisions.count }
    end

    it 'allows account manager to snapshot entries of own account' do
      user = create(:user, :account_manager)
      entry = create(:entry, :account => user.account)

      sign_in(user)
      post(:snapshot, :id => entry.id)

      expect {
        post(:snapshot, :id => entry.id)
      }.to change { entry.revisions.count }
    end

    it 'allows admin to snapshot entries of other accounts' do
      account = create(:account)
      entry = create(:entry)

      sign_in(create(:user, :admin))
      post(:snapshot, :id => entry.id)

      expect {
        post(:snapshot, :id => entry.id)
      }.to change { entry.revisions.count }
    end

    it 'allows editor to snapshot entries he is member of' do
      user = create(:user, :editor)
      entry = create(:entry, :with_member => user, :account => user.account)

      sign_in(user)
      post(:snapshot, :id => entry.id)

      expect {
        post(:snapshot, :id => entry.id)
      }.to change { entry.revisions.count }
    end

    it 'does not allows editor to snapshot entries he is not member of' do
      user = create(:user, :editor)
      entry = create(:entry, :account => user.account)

      sign_in(user)
      post(:snapshot, :id => entry.id)

      expect {
        post(:snapshot, :id => entry.id)
      }.not_to change { entry.revisions.count }
    end
  end
end
