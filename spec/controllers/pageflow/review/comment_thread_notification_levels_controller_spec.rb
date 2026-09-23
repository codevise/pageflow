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

      it 'says whether the entry is muted' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)

        sign_in(user, scope: :user)
        patch(:update,
              params: {entry_id: entry.id, id: thread.perma_id, level: 'muted'},
              format: 'json')

        expect(JSON.parse(response.body)['commentNotificationsMuted']).to eq(false)
      end

      describe 'watching a thread of a muted entry' do
        it 'lifts the entry to watched threads so the watch takes effect' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)
          thread = create(:comment_thread, revision: entry.draft)
          create(:entry_comment_notification_override, entry:, user:, level: 'muted')

          sign_in(user, scope: :user)
          patch(:update,
                params: {entry_id: entry.id, id: thread.perma_id, level: 'all_activity'},
                format: 'json')

          expect(EntryCommentNotificationOverride.find_by(entry:, user:).level)
            .to eq('watched_threads')
          expect(JSON.parse(response.body)).to include('level' => 'all_activity',
                                                       'commentNotificationsMuted' => false)
        end

        it 'leaves an entry that is not muted alone' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)
          thread = create(:comment_thread, revision: entry.draft)
          create(:entry_comment_notification_override,
                 entry:, user:, level: 'participating_threads')

          sign_in(user, scope: :user)
          patch(:update,
                params: {entry_id: entry.id, id: thread.perma_id, level: 'all_activity'},
                format: 'json')

          expect(EntryCommentNotificationOverride.find_by(entry:, user:).level)
            .to eq('participating_threads')
        end

        it 'leaves the entry muted when the thread is muted too' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)
          thread = create(:comment_thread, revision: entry.draft)
          create(:entry_comment_notification_override, entry:, user:, level: 'muted')

          sign_in(user, scope: :user)
          patch(:update,
                params: {entry_id: entry.id, id: thread.perma_id, level: 'muted'},
                format: 'json')

          expect(EntryCommentNotificationOverride.find_by(entry:, user:).level).to eq('muted')
          expect(JSON.parse(response.body)['commentNotificationsMuted']).to eq(true)
        end

        it 'keeps the entry muted when the thread level is rejected' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)
          thread = create(:comment_thread, revision: entry.draft)
          create(:entry_comment_notification_override, entry:, user:, level: 'muted')

          sign_in(user, scope: :user)
          patch(:update,
                params: {entry_id: entry.id, id: thread.perma_id, level: 'participating_threads'},
                format: 'json')

          expect(response.status).to eq(422)
          expect(EntryCommentNotificationOverride.find_by(entry:, user:).level).to eq('muted')
        end
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
