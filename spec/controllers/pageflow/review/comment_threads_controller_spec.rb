require 'spec_helper'

module Pageflow
  describe Review::CommentThreadsController do
    routes { Engine.routes }
    render_views

    describe '#index' do
      it 'returns threads with comments for draft revision' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        thread = create(:comment_thread,
                        revision: entry.draft,
                        creator: user)
        comment = create(:comment, comment_thread: thread, creator: user)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(200)
        expect(response.body).to include_json(
          currentUser: {
            id: user.id,
            name: user.full_name
          },
          commentThreads: [
            {
              id: thread.id,
              comments: [{id: comment.id}]
            }
          ]
        )
      end

      it 'does not have N+1 queries' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        thread = create(:comment_thread,
                        revision: entry.draft,
                        creator: user)
        create(:comment, comment_thread: thread, creator: user)
        create(:comment, comment_thread: thread, creator: create(:user))

        sign_in(user, scope: :user)

        detect_n_plus_one_queries do
          get(:index, params: {entry_id: entry.id}, format: 'json')
        end
      end

      it 'requires user to be signed in' do
        entry = create(:entry)

        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'requires read permission on entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.status).to eq(403)
      end
    end
  end
end
