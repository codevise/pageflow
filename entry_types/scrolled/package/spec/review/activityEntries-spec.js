import {act} from '@testing-library/react';

import {
  activityEntries,
  useActivityEntries,
  useUnreadThreadCount
} from 'review/activityEntries';
import {postReviewStateThreadChangeMessage} from 'review/postMessage';
import {renderHookWithReviewState} from 'support/renderWithReviewState';

const currentUser = {id: 42, name: 'Alice'};

function thread({id = 1, permaId = id + 4, comments = [], ...rest}) {
  return {id, permaId, comments, ...rest};
}

function comment({id = 100, creatorId = 43, creatorName = 'Bob', body = 'A comment', createdAt}) {
  return {id, creatorId, creatorName, body, createdAt};
}

describe('activityEntries', () => {
  it('emits one entry per thread', () => {
    const entries = activityEntries({
      threads: [thread({
        comments: [
          comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'}),
          comment({id: 101, body: 'A reply', createdAt: '2026-08-17T10:00:00.000Z'})
        ]
      })],
      currentUser,
      commentThreadReads: {}
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({key: 'thread-1', threadId: 1, threadPermaId: 5});
  });

  it('carries the thread along for rendering', () => {
    const commentThread = thread({
      comments: [comment({createdAt: '2026-08-17T09:00:00.000Z'})]
    });

    const entries = activityEntries({
      threads: [commentThread],
      currentUser,
      commentThreadReads: {}
    });

    expect(entries[0].thread).toBe(commentThread);
  });

  it('skips threads without any event', () => {
    const entries = activityEntries({
      threads: [thread({comments: []})],
      currentUser,
      commentThreadReads: {}
    });

    expect(entries).toEqual([]);
  });

  describe('latest event', () => {
    it('is the opening comment of a thread without replies', () => {
      const entries = activityEntries({
        threads: [thread({
          comments: [comment({createdAt: '2026-08-17T09:00:00.000Z'})]
        })],
        currentUser,
        commentThreadReads: {}
      });

      expect(entries[0]).toMatchObject({at: '2026-08-17T09:00:00.000Z'});
    });

    it('is the most recent reply of a thread with replies', () => {
      const entries = activityEntries({
        threads: [thread({
          comments: [
            comment({id: 100, createdAt: '2026-08-17T09:00:00.000Z'}),
            comment({id: 101, createdAt: '2026-08-17T10:00:00.000Z'})
          ]
        })],
        currentUser,
        commentThreadReads: {}
      });

      expect(entries[0]).toMatchObject({at: '2026-08-17T10:00:00.000Z'});
    });

    it('is the resolution of a resolved thread', () => {
      const entries = activityEntries({
        threads: [thread({
          comments: [comment({createdAt: '2026-08-17T09:00:00.000Z'})],
          resolvedAt: '2026-08-17T10:00:00.000Z',
          resolvedById: 44
        })],
        currentUser,
        commentThreadReads: {}
      });

      expect(entries[0]).toMatchObject({
        at: '2026-08-17T10:00:00.000Z',
        resolved: true
      });
    });
  });

  describe('order', () => {
    it('puts threads with the most recent activity first', () => {
      const entries = activityEntries({
        threads: [
          thread({id: 1, comments: [comment({id: 100, createdAt: '2026-08-17T09:00:00.000Z'})]}),
          thread({id: 2, comments: [comment({id: 200, createdAt: '2026-08-17T11:00:00.000Z'})]})
        ],
        currentUser,
        commentThreadReads: {}
      });

      expect(entries.map(entry => entry.threadId)).toEqual([2, 1]);
    });

    it('goes by the latest event rather than when the thread started', () => {
      const entries = activityEntries({
        threads: [
          thread({
            id: 1,
            comments: [
              comment({id: 100, createdAt: '2026-08-10T09:00:00.000Z'}),
              comment({id: 101, createdAt: '2026-08-17T12:00:00.000Z'})
            ]
          }),
          thread({id: 2, comments: [comment({id: 200, createdAt: '2026-08-17T11:00:00.000Z'})]})
        ],
        currentUser,
        commentThreadReads: {}
      });

      expect(entries.map(entry => entry.threadId)).toEqual([1, 2]);
    });

    it('keeps threads sharing a timestamp in a stable order', () => {
      const entries = activityEntries({
        threads: [
          thread({id: 2, comments: [comment({id: 200, createdAt: '2026-08-17T09:00:00.000Z'})]}),
          thread({id: 1, comments: [comment({id: 100, createdAt: '2026-08-17T09:00:00.000Z'})]})
        ],
        currentUser,
        commentThreadReads: {}
      });

      expect(entries.map(entry => entry.threadId)).toEqual([1, 2]);
    });
  });

  describe('unseen', () => {
    it('counts the events the reviewer has not seen', () => {
      const entries = activityEntries({
        threads: [thread({
          permaId: 5,
          comments: [
            comment({id: 100, createdAt: '2026-08-17T09:00:00.000Z'}),
            comment({id: 101, createdAt: '2026-08-17T11:00:00.000Z'}),
            comment({id: 102, createdAt: '2026-08-17T12:00:00.000Z'})
          ]
        })],
        currentUser,
        commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
      });

      expect(entries[0]).toMatchObject({
        unreadCount: 2,
        unreadCommentIds: [101, 102]
      });
    });

    it('does not count own comments', () => {
      const entries = activityEntries({
        threads: [thread({
          comments: [comment({creatorId: 42, createdAt: '2026-08-17T11:00:00.000Z'})]
        })],
        currentUser,
        commentThreadReads: {}
      });

      expect(entries[0]).toMatchObject({unreadCount: 0, unreadCommentIds: []});
    });

    // A resolution has no read record of its own, so it goes by the
    // thread's: opening the thread clears it.
    it('counts a resolution by the read state of its thread', () => {
      const threads = permaId => [thread({
        permaId,
        comments: [comment({createdAt: '2026-08-17T09:00:00.000Z'})],
        resolvedAt: '2026-08-17T11:00:00.000Z',
        resolvedById: 44
      })];

      const unread = activityEntries({
        threads: threads(5),
        currentUser,
        commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
      });
      const read = activityEntries({
        threads: threads(6),
        currentUser,
        commentThreadReads: {6: '2026-08-17T12:00:00.000Z'}
      });

      expect(unread[0].unreadCount).toEqual(1);
      expect(read[0].unreadCount).toEqual(0);
    });

    it('leaves the resolution out of the unseen comment ids', () => {
      const entries = activityEntries({
        threads: [thread({
          permaId: 5,
          comments: [
            comment({id: 100, createdAt: '2026-08-17T09:00:00.000Z'}),
            comment({id: 101, createdAt: '2026-08-17T11:00:00.000Z'})
          ],
          resolvedAt: '2026-08-17T12:00:00.000Z',
          resolvedById: 44
        })],
        currentUser,
        commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
      });

      expect(entries[0]).toMatchObject({unreadCount: 2, unreadCommentIds: [101]});
    });

    it('counts nothing while the current user is unknown', () => {
      const entries = activityEntries({
        threads: [thread({
          comments: [comment({createdAt: '2026-08-17T11:00:00.000Z'})]
        })],
        currentUser: null,
        commentThreadReads: {}
      });

      expect(entries[0].unreadCount).toEqual(0);
    });
  });

  describe('useActivityEntries', () => {
    const seed = {
      sections: [{id: 1, permaId: 100}],
      contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
    };

    const commentThread = {
      id: 1, permaId: 5,
      subjectType: 'ContentElement', subjectId: 10,
      comments: [
        {id: 100, creatorId: 43, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'},
        {id: 101, creatorId: 43, body: 'A reply', createdAt: '2026-08-17T11:00:00.000Z'}
      ]
    };

    it('derives entries from located threads and review state', () => {
      const {result} = renderHookWithReviewState(
        () => useActivityEntries(),
        {
          seed,
          currentUser,
          commentThreads: [commentThread],
          commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
        }
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0]).toMatchObject({
        threadId: 1,
        unreadCount: 1,
        unreadCommentIds: [101]
      });
    });

    it('includes threads whose content element is gone', () => {
      const orphan = {
        id: 2, permaId: 6,
        subjectType: 'ContentElement', subjectId: 999,
        sectionPermaId: 100,
        comments: [{id: 200, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'}]
      };

      const {result} = renderHookWithReviewState(
        () => useActivityEntries(),
        {seed, currentUser, commentThreads: [orphan]}
      );

      expect(result.current).toHaveLength(1);
      expect(result.current[0].thread.orphaned).toBe(true);
    });

    describe('while the feed is displayed', () => {
      const older = {
        id: 1, permaId: 5,
        subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, creatorId: 43, body: 'Older topic',
                    createdAt: '2026-08-17T09:00:00.000Z'}]
      };

      const newer = {
        id: 2, permaId: 6,
        subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 200, creatorId: 43, body: 'Newer topic',
                    createdAt: '2026-08-17T11:00:00.000Z'}]
      };

      function renderEntries() {
        return renderHookWithReviewState(
          () => useActivityEntries(),
          {seed, currentUser, commentThreads: [older, newer]}
        );
      }

      // Posting crosses the window boundary, so it has to be flushed
      // before the hook reflects it.
      async function postThreadChange(thread) {
        await act(async () => {
          postReviewStateThreadChangeMessage(window, thread);
          await new Promise(resolve => setTimeout(resolve, 0));
        });
      }

      function entryFor(entries, threadId) {
        return entries.find(entry => entry.threadId === threadId);
      }

      function withReply(thread, at) {
        return {
          ...thread,
          comments: [...thread.comments,
                     {id: 300, creatorId: currentUser.id, body: 'A reply', createdAt: at}]
        };
      }

      it('keeps threads in the place they had when it appeared', async () => {
        const {result} = renderEntries();

        await postThreadChange(withReply(older, '2026-08-17T12:00:00.000Z'));

        expect(result.current.map(entry => entry.threadId)).toEqual([2, 1]);
      });

      it('still reflects what was said', async () => {
        const {result} = renderEntries();

        await postThreadChange(withReply(older, '2026-08-17T12:00:00.000Z'));

        expect(entryFor(result.current, 1).thread.comments).toHaveLength(2);
      });

      it('keeps the time the place was taken', async () => {
        const {result} = renderEntries();

        await postThreadChange(withReply(older, '2026-08-17T12:00:00.000Z'));

        expect(entryFor(result.current, 1).at).toEqual('2026-08-17T09:00:00.000Z');
      });

      it('orders threads that turn up later by their own time', async () => {
        const {result} = renderEntries();

        await postThreadChange({
          id: 3, permaId: 7,
          subjectType: 'ContentElement', subjectId: 10,
          comments: [{id: 400, creatorId: 43, body: 'Newest topic',
                      createdAt: '2026-08-17T13:00:00.000Z'}]
        });

        expect(result.current.map(entry => entry.threadId)).toEqual([3, 2, 1]);
      });

      it('reflects the new order on the next visit', async () => {
        const {result: first} = renderEntries();

        await postThreadChange(withReply(older, '2026-08-17T12:00:00.000Z'));
        expect(first.current.map(entry => entry.threadId)).toEqual([2, 1]);

        const {result} = renderHookWithReviewState(
          () => useActivityEntries(),
          {
            seed,
            currentUser,
            commentThreads: [
              {...older,
               comments: [...older.comments,
                          {id: 300, creatorId: currentUser.id, body: 'A reply',
                           createdAt: '2026-08-17T12:00:00.000Z'}]},
              newer
            ]
          }
        );

        expect(result.current.map(entry => entry.threadId)).toEqual([1, 2]);
      });
    });

    describe('useUnreadThreadCount', () => {
      it('counts the threads carrying something new', () => {
        const {result} = renderHookWithReviewState(
          () => useUnreadThreadCount(),
          {
            seed,
            currentUser,
            commentThreads: [commentThread],
            commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
          }
        );

        expect(result.current).toEqual(1);
      });

      it('counts nothing once the thread has been read', () => {
        const {result} = renderHookWithReviewState(
          () => useUnreadThreadCount(),
          {
            seed,
            currentUser,
            commentThreads: [commentThread],
            commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}
          }
        );

        expect(result.current).toEqual(0);
      });
    });
  });
});
