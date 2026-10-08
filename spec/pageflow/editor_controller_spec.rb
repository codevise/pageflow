require 'spec_helper'
require 'pageflow/editor_controller_test_helper'

module Pageflow
  describe EditorController, type: :controller do
    include EditorControllerTestHelper

    controller(ActionController::Base) do
      include EditorController

      skip_before_action :verify_edit_lock, only: :index

      def index; end

      def create; end

      def update
        authorize!(:destroy, @entry.to_model)
      end

      def show
        @folders = authorized_scope(:browse, Folder)
        head :ok
      end
    end

    it 'requires authentication' do
      entry = create(:entry)

      post(:create,
           params: {entry_id: entry},
           format: 'json')

      expect(response.status).to eq(401)
    end

    it 'responds with not found for invalid entry id' do
      user = create(:user)

      sign_in(user, scope: :user)
      post(:create,
           params: {entry_id: 'not-there'},
           format: 'json')

      expect(response.status).to eq(404)
    end

    it 'responds with forbidden for entry previewer' do
      user = create(:user)
      account = create(:account, with_previewer: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      post(:create,
           params: {entry_id: entry},
           format: 'json')

      expect(response.status).to eq(403)
    end

    it 'responds with conflict for entry editor without edit lock' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      post(:create,
           params: {entry_id: entry},
           format: 'json')

      expect(response.status).to eq(409)
    end

    it 'allows skipping the verify_edit_lock before action' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      post(:index,
           params: {entry_id: entry},
           format: 'json')

      expect(response.status).to eq(204)
    end

    it 'is allowed for entry editor with edit lock' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
      post(:create,
           params: {entry_id: entry},
           format: 'json')

      expect(response.status).to eq(204)
    end

    it 'responds with forbidden if action is not authorized' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
      patch(:update,
            params: {id: 1, entry_id: entry},
            format: 'json')

      expect(response.status).to eq(403)
    end

    it 'assigns draft entry to @entry' do
      entry = create(:entry)

      authorize_for_editor_controller(entry)
      post(:create,
           params: {entry_id: entry},
           format: 'json')

      expect(assigns(:entry)).to be_a(DraftEntry)
    end

    it 'fails if entry type does not match entry_type param' do
      pageflow_configure do |config|
        TestEntryType.register(config, name: 'default')
        TestEntryType.register(config, name: 'other')
      end

      entry = create(:entry, type_name: 'other')

      authorize_for_editor_controller(entry)
      post(:create,
           params: {entry_type: 'default', entry_id: entry},
           format: 'json')

      expect(response.status).to eq(400)
    end

    it 'succeeds if entry type matches entry_type param' do
      pageflow_configure do |config|
        TestEntryType.register(config, name: 'default')
      end

      entry = create(:entry, type_name: 'default')

      authorize_for_editor_controller(entry)
      post(:create,
           params: {entry_type: 'default', entry_id: entry},
           format: 'json')

      expect(response.status).to eq(204)
    end

    it 'provides policy scopes of registered policies' do
      folder_policy = Class.new do
        const_set(:Scope, Class.new do
          def initialize(_user, scope)
            @scope = scope
          end

          def browse
            @scope.where(name: 'visible')
          end
        end)
      end
      pageflow_configure do |config|
        config.permissions.policies.register(folder_policy, model: Folder, actions: [:browse])
      end
      entry = create(:entry)
      folder = create(:folder, name: 'visible')
      create(:folder, name: 'hidden')

      authorize_for_editor_controller(entry)
      get(:show, params: {entry_id: entry, id: 1}, format: 'json')

      expect(assigns(:folders)).to eq([folder])
    end
  end
end
