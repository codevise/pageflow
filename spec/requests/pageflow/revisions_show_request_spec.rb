require 'spec_helper'

module Pageflow
  describe '/revisions/:id', type: :request do
    let(:entry_type_app) do
      lambda do |env|
        entry = EntriesControllerEnvHelper.get_published_entry_from_env(env)
        mode = EntriesControllerEnvHelper.get_entry_mode_from_env(env)

        ['200',
         {'Content-Type' => 'text/html'},
         ["#{entry.title} #{mode} rendered by entry type frontend app."]]
      end
    end

    before do
      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'test',
                               frontend_app: entry_type_app)
      end
    end

    describe 'with html format' do
      it 'delegates to entry type frontend app with scope' do
        user = create(:user)
        entry = create(:entry,
                       with_previewer: user,
                       type_name: 'test',
                       title: 'some-entry')
        revision = create(:revision, entry: entry)

        sign_in(user, scope: :user)
        get(revision_url(revision))

        expect(response.status).to eq(200)
        expect(response.body).to include('some-entry preview rendered by entry type frontend app')
      end

      it 'responds with success for previewers' do
        user = create(:user)
        entry = create(:entry, with_previewer: user, type_name: 'test')
        revision = create(:revision, entry: entry)

        sign_in(user, scope: :user)
        get(revision_url(revision))

        expect(response.status).to eq(200)
      end

      it 'responds with failure for less-than-previewers' do
        user = create(:user)
        entry = create(:entry, type_name: 'test')
        revision = create(:revision, entry: entry)

        sign_in(user, scope: :user)
        get(revision_url(revision))

        expect(response.status).to eq(302)
      end

      it 'requires the signed in user to be previewer of the parent entry' do
        user = create(:user)
        entry = create(:entry, type_name: 'test')
        revision = create(:revision, entry: entry)

        sign_in(user, scope: :user)
        get(revision_url(revision))

        expect(response.status).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry, type_name: 'test')
        revision = create(:revision, entry: entry)

        get(revision_url(revision))

        expect(response).to redirect_to(main_app.new_user_session_path)
      end
    end
  end
end
