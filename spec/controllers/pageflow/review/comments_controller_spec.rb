require 'spec_helper'

module Pageflow
  describe Review::CommentsController do
    routes { Engine.routes }
    render_views

    describe '#create' do
      it 'creates comment on thread' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft, creator: user)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread_id: thread.id,
               comment: {body: 'A reply'}
             }, format: 'json')

        expect(response.status).to eq(201)
        expect(response.body).to include_json(
          body: 'A reply',
          creatorId: user.id
        )
      end

      it 'creates comment with quote' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft, creator: user)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread_id: thread.id,
               comment: {body: 'Still wrong', quote: 'lazy dog'}
             }, format: 'json')

        expect(response.status).to eq(201)
        expect(response.body).to include_json(quote: 'lazy dog')
        expect(Pageflow::Comment.last.quote).to eq('lazy dog')
      end

      it 'requires user to be signed in' do
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)

        post(:create, params: {
               entry_id: entry.id,
               comment_thread_id: thread.id,
               comment: {body: 'Test'}
             }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'requires read permission on entry' do
        user = create(:user)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread_id: thread.id,
               comment: {body: 'Test'}
             }, format: 'json')

        expect(response.status).to eq(403)
      end
    end

    describe '#update' do
      it 'updates body of own comment' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft, creator: user)
        comment = create(:comment, comment_thread: thread, creator: user, body: 'Typo')

        sign_in(user, scope: :user)
        patch(:update, params: {
                entry_id: entry.id,
                comment_thread_id: thread.id,
                id: comment.id,
                comment: {body: 'Fixed'}
              }, format: 'json')

        expect(response.status).to eq(200)
        expect(response.body).to include_json(body: 'Fixed')
        expect(comment.reload.body).to eq('Fixed')
      end

      # The quote records the wording the comment referred to when it was
      # written. Editing must not make it describe some later version.
      it 'ignores attempts to change the quote' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft, creator: user)
        comment = create(:comment,
                         comment_thread: thread,
                         creator: user,
                         quote: 'lazy dog')

        sign_in(user, scope: :user)
        patch(:update, params: {
                entry_id: entry.id,
                comment_thread_id: thread.id,
                id: comment.id,
                comment: {body: 'Fixed', quote: 'quick fox'}
              }, format: 'json')

        expect(response.status).to eq(200)
        expect(comment.reload.quote).to eq('lazy dog')
      end

      it 'does not allow updating comment of other user' do
        user = create(:user)
        other_user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft, creator: other_user)
        comment = create(:comment,
                         comment_thread: thread,
                         creator: other_user,
                         body: 'Not yours')

        sign_in(user, scope: :user)
        patch(:update, params: {
                entry_id: entry.id,
                comment_thread_id: thread.id,
                id: comment.id,
                comment: {body: 'Hijacked'}
              }, format: 'json')

        expect(response.status).to eq(403)
        expect(comment.reload.body).to eq('Not yours')
      end

      it 'requires user to be signed in' do
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        comment = create(:comment, comment_thread: thread)

        patch(:update, params: {
                entry_id: entry.id,
                comment_thread_id: thread.id,
                id: comment.id,
                comment: {body: 'Test'}
              }, format: 'json')

        expect(response.status).to eq(401)
      end

      it 'requires read permission on entry' do
        user = create(:user)
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        comment = create(:comment, comment_thread: thread, creator: user)

        sign_in(user, scope: :user)
        patch(:update, params: {
                entry_id: entry.id,
                comment_thread_id: thread.id,
                id: comment.id,
                comment: {body: 'Test'}
              }, format: 'json')

        expect(response.status).to eq(403)
      end
    end
  end
end
