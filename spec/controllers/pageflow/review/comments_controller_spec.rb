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
  end
end
