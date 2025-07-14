require 'spec_helper'
require 'pageflow/caching_test_helpers'

module Pageflow
  describe Editor::EntriesController do
    routes { Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    describe '#index' do
      it 'returns entries json' do
        user = create(:user)
        entry = DraftEntry.new(create(:entry), build_stubbed(:revision))
        allow(DraftEntry).to receive(:accessible_by).and_return([entry])

        sign_in(user, scope: :user)
        get(:index, format: 'json')

        expect(json_response(path: [0, 'id'])).to eq(entry.id)
      end

      it 'requires user to be signed in' do
        get :index, format: 'json'

        expect(response.status).to eq(401)
      end
    end

    describe '#show' do
      describe 'with format html' do
        it 'reponds with success for editors of the entry' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry})

          expect(response.status).to eq(200)
        end

        it 'requires the signed in user to be member of the parent entry' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry})

          expect(response).to redirect_to(main_app.admin_root_path)
        end

        it 'requires authentication' do
          entry = create(:entry)

          get(:show, params: {id: entry})

          expect(response).to redirect_to(main_app.new_user_session_path)
        end

        it 'renders entry type specific head fragment' do
          renderer = double('renderer').as_null_object
          pageflow_configure do |config|
            TestEntryType.register(config,
                                   name: 'test',
                                   editor_fragment_renderer: renderer)
          end
          user = create(:user)
          entry = create(:entry, with_editor: user, type_name: 'test')

          allow(renderer)
            .to receive(:head_fragment).and_return('<script src="/test/editor.js">'.html_safe)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry})

          expect(response.body).to have_selector('script[src^="/test/editor.js"]',
                                                 visible: false)
        end

        it 'renders entry type specific body fragment' do
          renderer = double('renderer').as_null_object
          pageflow_configure do |config|
            TestEntryType.register(config,
                                   name: 'test',
                                   editor_fragment_renderer: renderer)
          end
          user = create(:user)
          entry = create(:entry, with_editor: user, type_name: 'test')

          allow(renderer)
            .to receive(:body_fragment).and_return('<div class="seed"></div>'.html_safe)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry})

          expect(response.body).to have_selector('div.seed')
        end
      end

      describe 'with format json' do
        it 'responds with success for editor of the entry' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry}, format: 'json')

          expect(response.status).to eq(200)
        end

        it 'includes file usage ids in response' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          file = create(:image_file)
          usage = create(:file_usage, file:, revision: entry.draft)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry}, format: 'json')

          expect(json_response(path: [:image_files, 0, :usage_id])).to eq(usage.id)
        end

        it 'does not cache files across entries', :use_clean_rails_memory_store_fragment_caching do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          other_entry = create(:entry, with_editor: user)
          file = create(:image_file)
          usage = create(:file_usage, file:, revision: entry.draft)
          create(:file_usage, file:, revision: other_entry.draft)

          sign_in(user, scope: :user)
          get(:show, params: {id: other_entry}, format: 'json')
          get(:show, params: {id: entry}, format: 'json')

          expect(json_response(path: [:image_files, 0, :usage_id])).to eq(usage.id)
        end

        it 'requires the signed in user to be previewer of the parent entry' do
          user = create(:user)
          entry = create(:entry)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry}, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'requires authentication' do
          entry = create(:entry)

          get(:show, params: {id: entry}, format: 'json')

          expect(response.status).to eq(401)
        end
      end
    end

    describe '#seed' do
      it 'reponds with success for members of the entry' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        get(:seed, params: {id: entry}, format: 'json')

        expect(response.status).to eq(200)
        expect { JSON.parse(response.body) }.not_to raise_error
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        get(:seed, params: {id: entry}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:seed, params: {id: entry}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'renders entry type specific seed fragment' do
        renderer = double('renderer').as_null_object
        pageflow_configure do |config|
          TestEntryType.register(config,
                                 name: 'test',
                                 editor_fragment_renderer: renderer)
        end
        user = create(:user)
        entry = create(:entry, with_editor: user, type_name: 'test')

        allow(renderer)
          .to receive(:seed_fragment).and_return('{"some": "json"}')

        sign_in(user, scope: :user)
        get(:seed, params: {id: entry}, format: 'json')

        expect(JSON.parse(response.body)).to include('entry_type' => {'some' => 'json'})
      end

      it 'renders last_published_with_noindex' do
        user = create(:user)
        entry = create(:entry,
                       :published_with_noindex,
                       with_editor: user)

        sign_in(user, scope: :user)
        get(:seed, params: {id: entry}, format: 'json')

        expect(response.body).to include_json(entry: {last_published_with_noindex: true})
      end

      it 'renders site cutoff mode' do
        pageflow_configure do |config|
          config.cutoff_modes.register('subscription_header', proc { true })
        end
        user = create(:user)
        site = create(:site, cutoff_mode_name: 'subscription_header')
        entry = create(:entry,
                       site:,
                       with_editor: user)

        sign_in(user, scope: :user)
        get(:seed, params: {id: entry}, format: 'json')

        expect(response.body).to include_json(site: {cutoff_mode_name: 'subscription_header'})
      end
    end

    describe '#update' do
      it 'responds with success' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {id: entry, entry: {title: 'new', credits: 'credits'}},
              format: 'json')

        expect(response.status).to eq(204)
      end

      it 'updates title and credits in draft' do
        user = create(:user)
        entry = create(:entry, with_editor: user)

        sign_in(user, scope: :user)
        acquire_edit_lock(user, entry)
        patch(:update,
              params: {id: entry, entry: {title: 'new', credits: 'credits'}},
              format: 'json')

        expect(entry.draft.reload.title).to eq('new')
        expect(entry.draft.credits).to eq('credits')
      end

      it 'requires the signed in user to be editor of the parent entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        patch(:update, params: {id: entry, entry: {}}, format: 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        patch(:update, params: {id: entry, chapter: {}}, format: 'json')

        expect(response.status).to eq(401)
      end
    end
  end
end
