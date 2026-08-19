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

      it 'returns subject_range of threads' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        create(:comment_thread,
               revision: entry.draft,
               creator: user,
               subject_range: {
                 'anchor' => {'path' => [0, 0], 'offset' => 5},
                 'focus' => {'path' => [0, 0], 'offset' => 12}
               })

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.body).to include_json(
          commentThreads: [
            {
              subjectRange: {
                'anchor' => {'path' => [0, 0], 'offset' => 5},
                'focus' => {'path' => [0, 0], 'offset' => 12}
              }
            }
          ]
        )
      end

      it 'returns section_perma_id of threads' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        create(:comment_thread,
               revision: entry.draft,
               creator: user,
               section_perma_id: 12)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.body).to include_json(
          commentThreads: [
            {sectionPermaId: 12}
          ]
        )
      end

      it 'returns quote of comments' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        thread = create(:comment_thread, revision: entry.draft, creator: user)
        create(:comment, comment_thread: thread, creator: user, quote: 'quick brown')

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(response.body).to include_json(
          commentThreads: [
            {comments: [{quote: 'quick brown'}]}
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

      it 'includes the unread baseline of the current user' do
        unread_comments_since_at = 2.hours.ago
        user = create(:user, unread_comments_since_at:)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        baseline = JSON.parse(response.body)['currentUser']['unreadCommentsSinceAt']

        expect(Time.zone.parse(baseline)).to eq(unread_comments_since_at)
      end

      it 'includes read timestamps of current user by thread perma id' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft, creator: user)
        read_at = 2.hours.ago
        create(:comment_thread_read,
               entry:,
               user:,
               comment_thread_perma_id: thread.perma_id,
               read_at:)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        reads = JSON.parse(response.body)['commentThreadReads']

        expect(Time.zone.parse(reads[thread.perma_id.to_s])).to eq(read_at)
      end

      it 'does not include read timestamps of other users' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        thread = create(:comment_thread, revision: entry.draft, creator: user)
        create(:comment_thread_read,
               entry:,
               user: create(:user),
               comment_thread_perma_id: thread.perma_id)

        sign_in(user, scope: :user)
        get(:index, params: {entry_id: entry.id}, format: 'json')

        expect(JSON.parse(response.body)['commentThreadReads']).to eq({})
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

      it 'creates thread with section_perma_id' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread: {
                 subject_type: 'ContentElement',
                 subject_id: 5,
                 section_perma_id: 12,
                 comment: {body: 'Looks good!'}
               }
             }, format: 'json')

        expect(response.status).to eq(201)
        expect(response.body).to include_json(sectionPermaId: 12)
        expect(Pageflow::CommentThread.last.section_perma_id).to eq(12)
      end

      it 'creates first comment with quote' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread: {
                 subject_type: 'ContentElement',
                 subject_id: 5,
                 comment: {body: 'About this text', quote: 'quick brown'}
               }
             }, format: 'json')

        expect(response.status).to eq(201)
        expect(response.body).to include_json(
          comments: [{body: 'About this text', quote: 'quick brown'}]
        )
        expect(Pageflow::Comment.last.quote).to eq('quick brown')
      end

      it 'creates thread with subject_range' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        subject_range = {
          'anchor' => {'path' => [0, 0], 'offset' => 5},
          'focus' => {'path' => [0, 0], 'offset' => 12}
        }

        sign_in(user, scope: :user)
        post(:create, params: {
               entry_id: entry.id,
               comment_thread: {
                 subject_type: 'ContentElement',
                 subject_id: 5,
                 subject_range:,
                 comment: {body: 'About this text'}
               }
             }, as: :json)

        expect(response.status).to eq(201)
        expect(response.body).to include_json(
          subjectRange: {
            'anchor' => {'path' => [0, 0], 'offset' => 5},
            'focus' => {'path' => [0, 0], 'offset' => 12}
          }
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
