require 'spec_helper'

module Pageflow
  describe RevisionsController do
    routes { Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    # Specs for #show can be found in
    # spec/requests/pageflow/revisions_show_request_spec.rb

    describe '#stylesheet' do
      include UsedFileTestHelper

      it 'includes rules for files in draft' do
        revision = create(:revision)
        entry = PublishedEntry.new(revision.entry, revision)
        image_file = create_used_file(:image_file, entry: entry)

        get(:stylesheet, params: {id: revision}, format: 'css')

        expect(response.body).to include(".image_#{image_file.perma_id}")
        expect(response.body).to include("url('#{image_file.attachment.url(:large)}')")
      end
    end

    describe '#depublish_current' do
      it 'does not depublish unpublished revision' do
        user = create(:user)
        entry = create(:entry, with_publisher: user)

        sign_in(user, scope: :user)
        delete(:depublish_current, params: {entry_id: entry})

        expect(response.status).to redirect_to(main_app.admin_entry_path(entry))
      end

      it 'depublishes published revision' do
        user = create(:user)
        entry = create(:entry, :published, with_publisher: user)

        sign_in(user, scope: :user)
        delete(:depublish_current, params: {entry_id: entry})

        expect(entry).not_to be_published
      end

      it 'requires the signed in user to be publisher of the parent entry or account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, account: account, with_editor: user)

        sign_in(user, scope: :user)
        delete(:depublish_current, params: {entry_id: entry})

        expect(response.status).to redirect_to(main_app.admin_root_path)
      end

      it 'requires authentication' do
        entry = create(:entry)

        delete(:depublish_current, params: {entry_id: entry})

        expect(response).to redirect_to(main_app.new_user_session_path)
      end
    end
  end
end
