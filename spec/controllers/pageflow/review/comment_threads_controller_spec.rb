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

    describe '#create' do
      it 'creates thread with first comment' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread: {
                 subject_type: 'ContentElement',
                 subject_id: 5,
                 comment: {body: 'Looks good!'}
               }
             }, format: 'json')

        expect(response.status).to eq(201)
        expect(response.body).to include_json(
          subjectType: 'ContentElement',
          subjectId: 5,
          creatorId: user.id,
          comments: [{body: 'Looks good!', creatorId: user.id}]
        )
      end

      it 'requires user to be signed in' do
        entry = create(:entry)

        post(:create, params: {
               entry_id: entry.id,
               comment_thread: {
                 subject_type: 'ContentElement',
                 subject_id: 5,
                 comment: {body: 'Test'}
               }
             }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'requires read permission on entry' do
        user = create(:user)
        entry = create(:entry)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread: {
                 subject_type: 'ContentElement',
                 subject_id: 5,
                 comment: {body: 'Test'}
               }
             }, format: 'json')

        expect(response.status).to eq(403)
      end
    end

    describe '#update' do
      it 'resolves a thread' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread,
                        revision: entry.draft,
                        creator: user)

        sign_in(user, scope: :user)
        patch(:update, params: {
                entry_id: entry.id,
                id: thread.id,
                comment_thread: {resolved: true}
              }, format: 'json')

        expect(response.status).to eq(200)
        expect(thread.reload.resolved_at).to be_present
        expect(thread.resolver).to eq(user)
        expect(response.body).to include_json(
          id: thread.id,
          resolvedAt: be_present
        )
      end

      it 'unresolves a thread' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        resolver = create(:user)
        thread = create(:comment_thread,
                        revision: entry.draft,
                        creator: user,
                        resolved_at: Time.current,
                        resolved_by_id: resolver.id)

        sign_in(user, scope: :user)
        patch(:update, params: {
                entry_id: entry.id,
                id: thread.id,
                comment_thread: {resolved: false}
              }, format: 'json')

        expect(response.status).to eq(200)
        expect(thread.reload.resolved_at).to be_nil
        expect(thread.resolver).to be_nil
        expect(response.body).to include_json(
          id: thread.id,
          resolvedAt: nil
        )
      end

      it 'requires user to be signed in' do
        entry = create(:entry)
        thread = create(:comment_thread,
                        revision: entry.draft,
                        creator: create(:user))

        patch(:update, params: {
                entry_id: entry.id,
                id: thread.id,
                comment_thread: {resolved: true}
              }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'requires read permission on entry' do
        user = create(:user)
        entry = create(:entry)
        thread = create(:comment_thread,
                        revision: entry.draft,
                        creator: create(:user))

        sign_in(user, scope: :user)
        patch(:update, params: {
                entry_id: entry.id,
                id: thread.id,
                comment_thread: {resolved: true}
              }, format: 'json')

        expect(response.status).to eq(403)
      end
    end
  end
end
