require 'spec_helper'

module Pageflow
  module Editor
    describe EntryPublicationsController do
      routes { Engine.routes }
      render_views

      describe '#create' do
        it 'responds with success for publishers' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry.id, entry_publication: {}}, format: :json)

          expect(response.status).to eq(200)
        end

        it 'includes published and published_until attributes in response' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create,
               params: {
                 entry_id: entry,
                 entry_publication: {published_until: 1.month.from_now}
               },
               format: :json)

          expect(json_response(path: [:entry, :published])).to eq(true)
          expect(json_response(path: [:entry, :published_until])).to eq(1.month.from_now.iso8601(3))
        end

        it 'allows to define published_until attribute' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry, entry_publication: {
                 published_until: 1.month.from_now
               }}, format: :json)
          revision = entry.revisions.published.last

          expect(revision.published_until).to eq(1.month.from_now)
        end

        it 'allows to publish with a password' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry, entry_publication: {
                 password_protected: true,
                 password: 'abc123abc'
               }}, format: :json)

          expect(entry.reload).to be_published_with_password('abc123abc')
        end

        it 'responds with bad request if password is missing' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry, entry_publication: {
                 password_protected: true
               }}, format: :json)

          expect(response.status).to eq(400)
        end

        it 'saves current user as creator' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry, entry_publication: {}}, format: :json)

          expect(entry.revisions.where(creator: user)).to be_present
        end

        it 'requires the signed in user to be publisher of the parent entry' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user, scope: :user)
          post(:create, params: {entry_id: entry, entry_publication: {}}, format: :json)

          expect(response.status).to eq(403)
        end

        it 'requires authentication' do
          entry = create(:entry)

          post(:create, params: {entry_id: entry, entry_publication: {}}, format: :json)

          expect(response.status).to eq(401)
        end

        it 'responds with forbidden if :published_entries quota would be exceeded' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          Pageflow.config.quotas.register(:published_entries, QuotaDouble.exceeded)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry, entry_publication: {}}, format: :json)

          expect(response.status).to eq(403)
        end

        it 'responds with success if :published_entries quota is exhausted but would not be '\
           'exceeded ' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          Pageflow.config.quotas.register(:published_entries, QuotaDouble.exhausted)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry, entry_publication: {}}, format: :json)

          expect(response.status).to eq(200)
        end

        it 'responds with published_message_html' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:create, params: {entry_id: entry.id, entry_publication: {}}, format: 'json')

          expect(json_response(path: :published_message_html)).not_to be_nil
        end
      end

      describe '#check' do
        it 'responds with non-exceeding state for available quota' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          sign_in(user, scope: :user)
          acquire_edit_lock(user, entry)
          post(:check, params: {entry_id: entry.id, entry_publication: {}}, format: 'json')

          expect(json_response(path: :exceeding)).to eq(false)
        end

        it 'responds with exceeding state for exceeded quota' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)
          Pageflow.config.quotas.register(:published_entries, QuotaDouble.exceeded)

          sign_in(user, scope: :user)
          post(:check, params: {entry_id: entry.id, entry_publication: {}}, format: 'json')

          expect(json_response(path: :exceeding)).to eq(true)
        end

        it 'responds with quota attributes' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)
          Pageflow.config.quotas.register(:published_entries, QuotaDouble.available)

          sign_in(user, scope: :user)
          post(:check, params: {entry_id: entry.id, entry_publication: {}}, format: 'json')

          expect(json_response(path: [:quota, :state])).to eq('available')
          expect(json_response(path: [:quota, :state_description])).to eq('Quota available')
        end

        it 'responds with exhausted_html' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)
          Pageflow.config.quotas.register(:published_entries, QuotaDouble.available)

          sign_in(user, scope: :user)
          post(:check, params: {entry_id: entry.id, entry_publication: {}}, format: 'json')

          expect(json_response(path: :exhausted_html)).to be_present
        end

        it 'is forbidden for entry the signed in user is not publisher of' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user, scope: :user)
          post(:check, params: {entry_id: entry.id, entry_publication: {}}, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'is forbidden if not signed in' do
          entry = create(:entry)

          post(:check, params: {entry_id: entry.id, entry_publication: {}}, format: 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
