require 'spec_helper'

module Pageflow
  describe Review::CommentThreadNotificationLevelsController do
    routes { Engine.routes }

    describe '#update' do
      it 'stores the level for the thread' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)

        sign_in(user, scope: :user)
        patch(:update,
              params: {entry_id: entry.id, id: thread.perma_id, level: 'muted'},
              format: 'json')

        expect(response.status).to eq(200)
        expect(JSON.parse(response.body)['level']).to eq('muted')
      end

      it 'removes the override for a blank level' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment_thread_notification_override,
               entry:, user:, comment_thread_perma_id: thread.perma_id, level: 'muted')

        sign_in(user, scope: :user)
        patch(:update,
              params: {entry_id: entry.id, id: thread.perma_id, level: ''},
              format: 'json')

        expect(CommentThreadNotificationOverride.count).to eq(0)
        expect(JSON.parse(response.body)['level']).to eq('all_activity')
      end

      it 'rejects a level the thread rung cannot store' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)

        sign_in(user, scope: :user)
        patch(:update,
              params: {entry_id: entry.id, id: thread.perma_id, level: 'participating_threads'},
              format: 'json')

        expect(response.status).to eq(422)
      end

      it 'does not store overrides for threads of other entries' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        other_thread = create(:comment_thread, revision: create(:entry).draft)

        sign_in(user, scope: :user)
        patch(:update,
              params: {entry_id: entry.id, id: other_thread.perma_id, level: 'muted'},
              format: 'json')

        expect(response.status).to eq(404)
        expect(CommentThreadNotificationOverride.count).to eq(0)
      end

      it 'requires read access to the entry' do
        user = create(:user)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)

        sign_in(user, scope: :user)
        patch(:update,
              params: {entry_id: entry.id, id: thread.perma_id, level: 'muted'},
              format: 'json')

        expect(response.status).to eq(403)
      end
    end
  end
end
