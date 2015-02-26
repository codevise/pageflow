require 'spec_helper'

module Pageflow
  module Editor
    describe EntryPublicationsController do
      routes { Engine.routes }
      render_views

      describe '#create' do
        it 'responds with success for members' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, :entry_id => entry.id, :entry_publication => {}, :format => :json)

          expect(response.status).to eq(200)
        end

        it 'includes published and published_until attributes in response' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, :entry_id => entry, :entry_publication => {:published_until => 1.month.from_now}, :format => :json)

          expect(json_response(:path => [:entry, :published])).to eq(true)
          expect(json_response(:path => [:entry, :published_until])).to eq(1.month.from_now.iso8601(3))
        end

        it 'allows to define published_until attributes' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, :entry_id => entry, :entry_publication => {
                 :published_until => 1.month.from_now
               }, :format => :json)
          revision = entry.revisions.published.last

          expect(revision.published_until).to eq(1.month.from_now)
        end

        it 'saves current user as creator' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, :entry_id => entry, :entry_publication => {}, :format => :json)

          expect(entry.revisions.where(:creator => user)).to be_present
        end

        it 'requires the signed in user to be member of the parent entry' do
          user = create(:user)
          entry = create(:entry)

          sign_in(user)
          post(:create, :entry_id => entry, :entry_publication => {}, :format => :json)

          expect(response.status).to eq(403)
        end

        it 'requires authentication' do
          entry = create(:entry)

          post(:create, :entry_id => entry, :entry_publication => {}, :format => :json)

          expect(response.status).to eq(401)
        end

        it 'responds with forbidden if :published_entries quota would be exceeded' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          Pageflow.config.quotas.register(:published_entries, QuotaDouble.exceeded)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, :entry_id => entry, :entry_publication => {}, :format => :json)

          expect(response.status).to eq(403)
        end

        it 'responds with success if :published_entries quota is exhausted but would not be exceeded ' do
          user = create(:user)
          entry = create(:entry, :with_member => user)

          Pageflow.config.quotas.register(:published_entries, QuotaDouble.exhausted)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, :entry_id => entry, :entry_publication => {}, :format => :json)

          expect(response.status).to eq(200)
        end

        it 'responds with published_message_html' do
          user = create(:user)
          entry = create(:entry, with_member: user)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, entry_id: entry.id, entry_publication: {}, format: 'json')

          expect(json_response(path: :published_message_html)).not_to be_nil
        end
      end

      describe '#check' do
        it 'responds with exceeding state for available quota' do
          user = create(:user)
          entry = create(:entry, with_member: user)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:check, entry_id: entry.id, entry_publication: {}, format: 'json')

          expect(json_response(path: :exceeding)).to eq(false)
        end

        it 'responds with exceeding state for exceeded quota' do
          user = create(:user)
          entry = create(:entry, with_member: user)
          Pageflow.config.quotas.register(:published_entries, QuotaDouble.exceeded)

          sign_in(user)
          post(:check, entry_id: entry.id, entry_publication: {}, format: 'json')

          expect(json_response(path: :exceeding)).to eq(true)
        end

        it 'responds with quota attributes' do
          user = create(:user)
          entry = create(:entry, with_member: user)
          Pageflow.config.quotas.register(:published_entries, QuotaDouble.available)

          sign_in(user)
          post(:check, entry_id: entry.id, entry_publication: {}, format: 'json')

          expect(json_response(path: [:quota, :state])).to eq('available')
          expect(json_response(path: [:quota, :state_description])).to eq('Quota available')
        end

        it 'responds with exhausted_html' do
          user = create(:user)
          entry = create(:entry, with_member: user)
          Pageflow.config.quotas.register(:published_entries, QuotaDouble.available)

          sign_in(user)
          post(:check, entry_id: entry.id, entry_publication: {}, format: 'json')

          expect(json_response(path: :exhausted_html)).to be_present
        end

        it 'forbidden for entry the signed in user is not member of' do
          user = create(:user)
          entry = create(:entry)

          sign_in(user)
          post(:check, entry_id: entry.id, entry_publication: {}, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'is forbidden if not signed in' do
          entry = create(:entry)

          post(:check, entry_id: entry.id, entry_publication: {}, format: 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
