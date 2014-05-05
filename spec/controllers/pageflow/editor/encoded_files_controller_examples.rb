require 'spec_helper'

shared_examples 'encoded files controller' do
  describe '#index' do
    it 'returns list of files of entry' do
      user = create(:user, :editor)
      entry = create(:entry, :with_member => user)
      file = create(model_name)
      create(:file_usage, :revision => entry.draft, :file => file)

      sign_in(user)
      get(:index, :entry_id => entry.id, :format => 'json')

      expect(json_response(:path => [0, 'id'])).to eq(file.id)
    end

    it 'does not allow to list files of unaccessible entry' do
      user = create(:user, :editor)
      entry = create(:entry)
      file = create(model_name)
      create(:file_usage, :revision => entry.draft, :file => file)

      sign_in(user)
      get(:index, :entry_id => entry.id, :format => 'json')

      expect(response.status).to eq(403)
    end

    it 'requires user to be signed in' do
      entry = create(:entry)
      get(:index, :entry_id => entry.id, :format => 'json')

      expect(response.status).to eq(401)
    end
  end

  describe '#create' do
    it 'responds with success for signed in member of the entry' do
      user = create(:user)
      entry = create(:entry, :with_member => user)

      sign_in(user)
      aquire_edit_lock(user, entry)
      post :create, :entry_id => entry, model_name => {:attachment => fixture_upload}, :format => 'json'

      expect(response.status).to eq(200)
    end

    it 'creates file for entry' do
      user = create(:user)
      entry = create(:entry, :with_member => user)

      sign_in(user)
      aquire_edit_lock(user, entry)
      post :create, :entry_id => entry, model_name => {:attachment => fixture_upload}, :format => 'json'

      expect(files_collection(entry)).to have(1).item
    end

    it 'includes usage_id in response' do
      user = create(:user)
      entry = create(:entry, :with_member => user)

      sign_in(user)
      aquire_edit_lock(user, entry)
      post :create, :entry_id => entry, model_name => {:attachment => fixture_upload}, :format => 'json'

      expect(json_response(:path => [:usage_id])).to be_present
    end

    it 'uploads attachment' do
      user = create(:user)
      entry = create(:entry)
      create(:membership, :user => user, :entry => entry)

      sign_in user
      aquire_edit_lock(user, entry)
      post :create, :entry_id => entry, model_name => {:attachment => fixture_upload}, :format => 'json'

      expect(files_collection(entry).first.send(attachment)).to be_present
    end

    it 'does not allow to create file for entry the signed in user is not memeber of' do
      user = create(:user)
      entry = create(:entry)

      sign_in user
      post :create, :entry_id => entry, model_name => {:attachment => fixture_upload}, :format => 'json'

      expect(response.status).to eq(403)
    end

    it 'does not allow to create file if not signed in' do
      entry = create(:entry)

      post :create, :entry_id => entry, model_name => {:attachment => fixture_upload}, :format => 'json'

      expect(response.status).to eq(401)
    end
  end

  describe '#retry' do
    it 'succeeds if encoding/processing failed' do
      user = create(:user)
      entry = create(:entry, :with_member => user)
      file = create(model_name, failed_trait, :used_in => entry.draft)

      sign_in user
      aquire_edit_lock(user, entry)
      post :retry, :id => file, :format => 'json'

      expect(response.status).to eq(201)
    end

    it 'does not allow to retry encoding of file for entry the signed in user is not member of' do
      user = create(:user)
      file = create(model_name, failed_trait)

      sign_in user
      post :retry, :id => file, :format => 'json'

      expect(response.status).to eq(403)
    end

    it 'does not allow to retry encoding of file if not signed in' do
      file = create(model_name, failed_trait)

      post :retry, :id => file, :format => 'json'

      expect(response.status).to eq(401)
    end
  end

  describe '#update' do
    it 'signed in member of the entry can update rights' do
      user = create(:user)
      entry = create(:entry, :with_member => user)
      file = create(model_name, :used_in => entry.draft, :rights => 'old')

      sign_in user
      aquire_edit_lock(user, entry)
      patch :update, :id => file, model_name => {:rights => 'new'}, :format => 'json'

      expect(response.status).to eq(204)
      expect(file.reload.rights).to eq('new')
    end

    it 'does not allow to update file if the signed in user is not member of' do
      user = create(:user)
      file = create(model_name)

      sign_in user
      patch :update, :id => file, model_name => {:rights => 'new'}, :format => 'json'

      expect(response.status).to eq(403)
    end

    it 'does not allow to updat file if not signed in' do
      file = create(model_name)

      patch :update, :id => file, model_name => {:rights => 'new'}, :format => 'json'

      expect(response.status).to eq(401)
    end
  end

  def files_collection(record)
    record.send(model_name.to_s.pluralize)
  end
end
