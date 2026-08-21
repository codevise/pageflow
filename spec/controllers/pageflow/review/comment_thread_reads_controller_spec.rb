require 'spec_helper'

module Pageflow
  describe Review::CommentThreadReadsController do
    routes { Engine.routes }

    describe '#create' do
      it 'marks comment threads as read for current user' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread_perma_ids: [thread.perma_id]
             }, format: 'json')

        expect(response.status).to eq(204)
        expect(CommentThreadRead.where(entry:, user:).pluck(:comment_thread_perma_id))
          .to eq([thread.perma_id])
      end

      it 'moves read at timestamp of already read thread forward' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft)
        read = create(:comment_thread_read,
                      entry:,
                      user:,
                      comment_thread_perma_id: thread.perma_id,
                      read_at: 2.hours.ago)

        sign_in(user, scope: :user)

        Timecop.freeze(1.hour.from_now) do
          post(:create, params: {
                 entry_id: entry.id,
                 comment_thread_perma_ids: [thread.perma_id]
               }, format: 'json')

          expect(read.reload.read_at).to eq(Time.current)
        end

        expect(CommentThreadRead.count).to eq(1)
      end

      it 'ignores perma ids of threads not belonging to entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        other_entry = create(:entry, with_previewer: user)
        other_thread = create(:comment_thread, revision: other_entry.draft)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread_perma_ids: [other_thread.perma_id]
             }, format: 'json')

        expect(response.status).to eq(204)
        expect(CommentThreadRead.count).to eq(0)
      end

      it 'ignores blank list of perma ids' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        post(:create, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(204)
        expect(CommentThreadRead.count).to eq(0)
      end

      it 'requires user to be signed in' do
        entry = create(:entry)

        post(:create, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'requires read permission on entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user, scope: :user)
        post(:create, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(403)
      end
    end
  end
end
