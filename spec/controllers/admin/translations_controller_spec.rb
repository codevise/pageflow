require 'spec_helper'

describe Admin::TranslationsController do
  render_views

  describe '#index' do
    it 'redirects to entry page' do
      admin = create(:user, :admin)
      sign_in(admin, scope: :user)
      entry = create(:entry)

      get(:index,
          params: {
            entry_id: entry
          })

      expect(response)
        .to redirect_to(admin_entry_path(id: entry, tab: 'translations'))
    end
  end

  describe '#new' do
    it 'requires publisher role on account' do
      entry = create(:entry)
      user = create(:user, :editor, on: entry.account)

      sign_in(user, scope: :user)
      get(:new, params: {entry_id: entry})

      expect(flash[:error]).to be_present
      expect(response).to redirect_to(admin_root_path)
    end

    it 'displays parent entry in disabled select' do
      entry = create(:entry)
      user = create(:user, :publisher, on: entry.account)

      sign_in(user, scope: :user)
      get(:new, params: {entry_id: entry})

      expect(response.status).to eq(200)
      expect(response.body).to have_field('entry[entry_id]', disabled: true, with: entry.id)
    end
  end

  describe '#create' do
    it 'lets account publisher mark as translation of other entry' do
      entry = create(:entry)
      translation = create(:entry, account: entry.account)
      user = create(:user, :publisher, on: entry.account)

      sign_in(user, scope: :user)
      post(:create, params: {entry_id: entry, entry: {id: translation}})

      expect(response)
        .to redirect_to(admin_entry_path(id: entry, tab: 'translations'))
      expect(entry.reload.translations).to include(translation)
    end

    it 'requires publisher role on account' do
      entry = create(:entry)
      translation = create(:entry, account: entry.account)
      user = create(:user, :editor, on: entry.account)

      sign_in(user, scope: :user)
      post(:create, params: {entry_id: entry, entry: {id: translation}})

      expect(entry.reload.translations).to be_empty
      expect(flash[:error]).to be_present
      expect(response).to redirect_to(admin_root_path)
    end

    it 'does not allow marking entry of other account as translation' do
      entry = create(:entry)
      user = create(:user, :publisher, on: entry.account)
      entry_of_other_account = create(:entry)

      sign_in(user, scope: :user)
      post(:create, params: {entry_id: entry, entry: {id: entry_of_other_account}})

      expect(entry.reload.translations).to be_empty
      expect(flash[:error]).to be_present
      expect(response).to redirect_to(admin_root_path)
    end
  end

  describe '#destroy' do
    it 'lets account publisher remove entry from translation group' do
      entry = create(:entry)
      translation = create(:entry, account: entry.account)
      entry.mark_as_translation_of(translation)
      user = create(:user, :publisher, on: entry.account)

      sign_in(user, scope: :user)
      delete(:destroy, params: {entry_id: entry, id: translation})

      expect(response)
        .to redirect_to(admin_entry_path(id: entry, tab: 'translations'))
      expect(entry.reload.translations).to be_empty
    end

    it 'requires publisher role on account' do
      entry = create(:entry)
      translation = create(:entry, account: entry.account)
      entry.mark_as_translation_of(translation)
      user = create(:user, :editor, on: entry.account)

      sign_in(user, scope: :user)
      delete(:destroy, params: {entry_id: entry, id: translation})

      expect(entry.reload.translations).to eq([entry, translation])
      expect(flash[:error]).to be_present
      expect(response).to redirect_to(admin_root_path)
    end
  end

  describe '#potential_entry_translations' do
    it 'lists entries from same account' do
      entry = create(:entry)
      translation = create(:entry, account: entry.account)
      user = create(:user, :publisher, on: entry.account)

      sign_in(user, scope: :user)
      get(:potential_entry_translations_options, params: {entry_id: entry}, format: :json)

      expect(response.body).to include_json(results: [
                                              {text: translation.title, id: translation.id}
                                            ])
    end

    it 'requires publisher role on account' do
      entry = create(:entry)
      user = create(:user, :editor, on: entry.account)

      sign_in(user, scope: :user)
      get(:potential_entry_translations_options, params: {entry_id: entry}, format: :json)

      expect(response.status).to eq(401)
    end
  end
end
