require 'spec_helper'

module Pageflow
  describe EntriesController do
    routes { Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    describe '#edit' do
      it 'reponds with success for members of the entry' do
        user = create(:user)
        entry = create(:entry, :with_member => user)

        sign_in(user)
        get(:edit, :id => entry)

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user)
        get(:edit, :id => entry)

        expect(response).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:edit, :id => entry)

        expect(response).to redirect_to(main_app.new_user_session_path)
      end
    end

    describe '#update' do
      it 'responds with sucess' do
        user = create(:user)
        entry = create(:entry)
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:update, :id => entry, :entry => {:title => 'new', :credits => 'credits'}, :format => 'json')

        expect(response.status).to eq(204)
      end

      it 'updates title and credits in draft' do
        user = create(:user)
        entry = create(:entry)
        create(:membership, :entry => entry, :user => user)

        sign_in user
        aquire_edit_lock(user, entry)
        patch(:update, :id => entry, :entry => {:title => 'new', :credits => 'credits'}, :format => 'json')

        expect(entry.draft.reload.title).to eq('new')
        expect(entry.draft.credits).to eq('credits')
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in user
        patch(:update, :id => entry, :entry => {}, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires authentication' do
        entry = create(:entry)

        patch(:update, :id => entry, :chapter => {}, :format => 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#show' do
      context 'with format html' do
        it 'responds with success for published entry' do
          entry = create(:entry, :published)

          get(:show, :id => entry)

          expect(response.status).to eq(200)
        end

        it 'responds with not found for not published entry' do
          entry = create(:entry)

          get(:show, :id => entry)

          expect(response.status).to eq(404)
        end
      end

      context 'with format css' do
        it 'responds with success for published entry' do
          entry = create(:entry, :published)

          get(:show, :id => entry, :format => 'css')

          expect(response.status).to eq(200)
        end

        it 'responds with not found for not published entry' do
          entry = create(:entry)

          get(:show, :id => entry, :format => 'css')

          expect(response.status).to eq(404)
        end
      end

      context 'with format json' do
        it 'responds with success for members of the entry' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          sign_in(user)
          get(:show, :id => entry, :format => 'json')

          expect(response.status).to eq(200)
        end

        it 'includes file usage ids in response' do
          user = create(:user)
          entry = create(:entry, :with_member => user)
          file = create(:image_file)
          usage = create(:file_usage, :file => file, :revision => entry.draft)

          sign_in(user)
          get(:show, :id => entry, :format => 'json')

          expect(json_response(:path => [:image_files, 0, :usage_id])).to eq(usage.id)
        end

        it 'requires the signed in user to be member of the parent entry' do
          user = create(:user)
          entry = create(:entry)

          sign_in(user)
          get(:show, :id => entry, :format => 'json')

          expect(response.status).to eq(403)
        end

        it 'requires authentication' do
          entry = create(:entry)

          get(:show, :id => entry, :format => 'json')

          expect(response.status).to eq(401)
        end
      end

      context 'with other format' do
        it 'responds with not found' do
          get(:show, :id => 1, :format => 'png')

          expect(response.status).to eq(404)
        end
      end
    end

    describe '#page' do
      it 'redirects to entry path with page perma id anchor' do
        entry = create(:entry, :published, :title => 'report')
        chapter = create(:chapter, :revision => entry.published_revision)
        page = create(:page, :chapter => chapter)

        get(:page, :id => entry, :page_index => 0)

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'removes suffix appended with slash' do
        entry = create(:entry, :published, :title => 'report')
        chapter = create(:chapter, :revision => entry.published_revision)
        page = create(:page, :chapter => chapter)

        get(:page, :id => entry, :page_index => '0-some-title')

        expect(response).to redirect_to("/report##{page.perma_id}")
      end

      it 'skips hash if page index is invalid' do
        entry = create(:entry, :published, :title => 'report')
        chapter = create(:chapter, :revision => entry.published_revision)
        page = create(:page, :chapter => chapter)

        get(:page, :id => entry, :page_index => '100-not-there')

        expect(response).to redirect_to("/report")
      end
    end
  end
end
