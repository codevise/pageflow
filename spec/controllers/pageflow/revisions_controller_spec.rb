require 'spec_helper'

module Pageflow
  describe RevisionsController do
    routes { Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    describe '#show' do
      it 'responds with success for members' do
        user = create(:user)
        entry = create(:entry, :with_member => user)
        revision = create(:revision, :entry => entry)

        sign_in(user)
        get(:show, :id => revision)

        expect(response.status).to eq(200)
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        revision = create(:revision)

        sign_in(user)
        get(:show, :id => revision)

        expect(response.status).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        revision = create(:revision)

        get(:show, :id => revision)

        expect(response).to redirect_to(main_app.new_user_session_path)
      end
    end

    describe '#depublish_current' do
      it 'depublished current revision' do
        user = create(:user)
        entry = create(:entry, :with_member => user)

        sign_in(user)
        delete(:depublish_current, :entry_id => entry)

        expect(response.status).to redirect_to(main_app.admin_entry_path(entry))
      end

      it 'depublished current revision' do
        user = create(:user)
        entry = create(:entry, :published, :with_member => user)

        sign_in(user)
        delete(:depublish_current, :entry_id => entry)

        expect(entry).not_to be_published
      end

      it 'requires the signed in user to be member of the parent entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user)
        delete(:depublish_current, :entry_id => entry)

        expect(response.status).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        delete(:depublish_current, :entry_id => entry)

        expect(response).to redirect_to(main_app.new_user_session_path)
      end
    end
  end
end
