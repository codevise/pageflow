require 'spec_helper'

describe Admin::RevisionsController do
  describe '#restore' do
    it 'does not allow account manager to restore revisions for other account' do
      account = create(:account)
      entry = create(:entry)
      earlier_revision = create(:revision, :frozen, :entry => entry)

      sign_in(create(:user, :account_manager))

      expect {
        post(:restore, :id => earlier_revision.id)
      }.not_to change { entry.revisions.count }
    end

    it 'allows account manager to restore revisions for own account' do
      user = create(:user, :account_manager)
      entry = create(:entry, :account => user.account)
      earlier_revision = create(:revision, :frozen, :entry => entry, :title => 'the way it used to be')

      sign_in(user)
      post(:restore, :id => earlier_revision.id)

      expect(entry.draft(true).title).to eq('the way it used to be')
    end

    it 'allows admin to restore revisions for other accounts' do
      account = create(:account)
      entry = create(:entry)
      earlier_revision = create(:revision, :frozen, :entry => entry, :title => 'the way it used to be')

      sign_in(create(:user, :admin))
      post(:restore, :id => earlier_revision.id)

      expect(entry.draft(true).title).to eq('the way it used to be')
    end

    it 'allows editor to restore revisions for entries he is member of' do
      user = create(:user, :editor)
      entry = create(:entry, :with_member => user, :account => user.account)
      earlier_revision = create(:revision, :frozen, :entry => entry, :title => 'the way it used to be')

      sign_in(user)
      post(:restore, :id => earlier_revision.id)

      expect(entry.draft(true).title).to eq('the way it used to be')
    end

    it 'does not allows editor to restore revisions for entries he is not member of' do
      user = create(:user, :editor)
      entry = create(:entry, :account => user.account)
      earlier_revision = create(:revision, :frozen, :entry => entry)

      sign_in(user)
      post(:restore, :id => earlier_revision.id)

      expect {
        post(:restore, :id => earlier_revision.id)
      }.not_to change { entry.revisions.count }
    end

    it 'needs to be able to aquire an edit lock' do
      user = create(:user, :editor)
      entry = create(:entry, :with_member => user, :account => user.account)
      earlier_revision = create(:revision, :frozen, :entry => entry)

      aquire_edit_lock(create(:user), entry)
      sign_in(user)
      request.env['HTTP_REFERER'] = admin_entry_path(entry)

      expect {
        post(:restore, :id => earlier_revision.id)
      }.not_to change { entry.revisions.count }
    end
  end
end
