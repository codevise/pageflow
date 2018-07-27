require 'spec_helper'

describe Admin::RevisionsController do
  describe '#restore' do
    it 'does not allow account editor to restore revisions for other account' do
      user = create(:user)
      create(:account, with_editor: user)
      entry = create(:entry)
      earlier_revision = create(:revision, :frozen, entry: entry)

      sign_in(user, scope: :user)

      expect do
        post(:restore, params: {id: earlier_revision.id})
      end.not_to change { entry.revisions.count }
    end

    it 'allows account editor to restore revisions for own account' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account: account)
      earlier_revision = create(:revision, :frozen, entry: entry, title: 'the way it used to be')

      sign_in(user, scope: :user)
      post(:restore, params: {id: earlier_revision.id})

      expect(entry.reload_draft.title).to eq('the way it used to be')
    end

    it 'allows admin to restore revisions for other accounts' do
      entry = create(:entry)
      earlier_revision = create(:revision, :frozen, entry: entry, title: 'the way it used to be')

      sign_in(create(:user, :admin), scope: :user)
      post(:restore, params: {id: earlier_revision.id})

      expect(entry.reload_draft.title).to eq('the way it used to be')
    end

    it 'allows editor to restore revisions for their entries' do
      user = create(:user)
      entry = create(:entry, with_editor: user)
      earlier_revision = create(:revision, :frozen, entry: entry, title: 'the way it used to be')

      sign_in(user, scope: :user)
      post(:restore, params: {id: earlier_revision.id})

      expect(entry.reload_draft.title).to eq('the way it used to be')
    end

    it 'does not allow user to restore revisions for entries they are not editor of' do
      user = create(:user)
      entry = create(:entry, with_previewer: user)
      earlier_revision = create(:revision, :frozen, entry: entry)

      sign_in(user, scope: :user)
      post(:restore, params: {id: earlier_revision.id})

      expect do
        post(:restore, params: {id: earlier_revision.id})
      end.not_to change { entry.revisions.count }
    end

    it 'needs to be able to acquire an edit lock' do
      user = create(:user)
      entry = create(:entry, with_editor: user)
      earlier_revision = create(:revision, :frozen, entry: entry)

      acquire_edit_lock(create(:user), entry)
      sign_in(user, scope: :user)
      request.env['HTTP_REFERER'] = admin_entry_path(entry)

      expect do
        post(:restore, params: {id: earlier_revision.id})
      end.not_to change { entry.revisions.count }
    end
  end
end
