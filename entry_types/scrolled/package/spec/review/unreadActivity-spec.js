import {isUnread, unreadActivity, useUnreadActivity} from 'review/unreadActivity';
import {renderHookWithReviewState} from 'support/renderWithReviewState';

describe('unreadActivity', () => {
  const currentUser = {id: 42, name: 'Alice'};

  function thread(comments) {
    return {id: 1, permaId: 5, comments};
  }

  it('returns comments created after read timestamp', () => {
    const result = unreadActivity(
      thread([
        {id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
        {id: 101, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}
      ]),
      {currentUser, readAt: '2026-08-17T10:00:00.000Z'}
    );

    expect(result.map(comment => comment.id)).toEqual([101]);
  });

  it('counts a resolution by someone else', () => {
    const result = unreadActivity(
      {
        ...thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'}]),
        resolvedAt: '2026-08-17T13:00:00.000Z',
        resolvedById: 44
      },
      {currentUser, readAt: '2026-08-17T10:00:00.000Z'}
    );

    expect(result).toHaveLength(1);
    expect(result[0].createdAt).toEqual('2026-08-17T13:00:00.000Z');
  });

  it('does not count the reviewer resolving a thread themselves', () => {
    const result = unreadActivity(
      {
        ...thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'}]),
        resolvedAt: '2026-08-17T13:00:00.000Z',
        resolvedById: currentUser.id
      },
      {currentUser, readAt: '2026-08-17T10:00:00.000Z'}
    );

    expect(result).toEqual([]);
  });

  it('does not count a resolution the reviewer has seen', () => {
    const result = unreadActivity(
      {
        ...thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'}]),
        resolvedAt: '2026-08-17T13:00:00.000Z',
        resolvedById: 44
      },
      {currentUser, readAt: '2026-08-17T14:00:00.000Z'}
    );

    expect(result).toEqual([]);
  });

  it('returns all comments of never read thread', () => {
    const result = unreadActivity(
      thread([
        {id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
        {id: 101, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}
      ]),
      {currentUser, readAt: undefined}
    );

    expect(result.map(comment => comment.id)).toEqual([100, 101]);
  });

  it('excludes comments of current user', () => {
    const result = unreadActivity(
      thread([
        {id: 100, creatorId: 42, createdAt: '2026-08-17T11:00:00.000Z'},
        {id: 101, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}
      ]),
      {currentUser, readAt: undefined}
    );

    expect(result.map(comment => comment.id)).toEqual([101]);
  });

  it('returns nothing while current user is unknown', () => {
    const result = unreadActivity(
      thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}]),
      {currentUser: null, readAt: undefined}
    );

    expect(result).toEqual([]);
  });

  describe('with a baseline on the current user', () => {
    const joinedUser = {...currentUser, unreadCommentsSinceAt: '2026-08-17T10:00:00.000Z'};

    it('ignores comments from before the baseline', () => {
      const result = unreadActivity(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'}]),
        {currentUser: joinedUser, readAt: undefined}
      );

      expect(result).toEqual([]);
    });

    it('returns comments from after the baseline', () => {
      const result = unreadActivity(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}]),
        {currentUser: joinedUser, readAt: undefined}
      );

      expect(result.map(comment => comment.id)).toEqual([100]);
    });

    it('prefers a later read timestamp over the baseline', () => {
      const result = unreadActivity(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}]),
        {currentUser: joinedUser, readAt: '2026-08-17T12:00:00.000Z'}
      );

      expect(result).toEqual([]);
    });

    it('prefers the baseline over an earlier read timestamp', () => {
      const result = unreadActivity(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T09:30:00.000Z'}]),
        {currentUser: joinedUser, readAt: '2026-08-17T09:00:00.000Z'}
      );

      expect(result).toEqual([]);
    });
  });

  it('compares timestamps of different time zone offsets', () => {
    const result = unreadActivity(
      thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T12:00:00.000+02:00'}]),
      {currentUser, readAt: '2026-08-17T11:00:00.000Z'}
    );

    expect(result).toEqual([]);
  });

  describe('isUnread', () => {
    it('is true for a comment created after the read timestamp', () => {
      const result = isUnread(
        {creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'},
        {currentUser, readAt: '2026-08-17T10:00:00.000Z'}
      );

      expect(result).toBe(true);
    });

    it('is false for a comment created before the read timestamp', () => {
      const result = isUnread(
        {creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
        {currentUser, readAt: '2026-08-17T10:00:00.000Z'}
      );

      expect(result).toBe(false);
    });

    it('is true for a comment in a never read thread', () => {
      const result = isUnread(
        {creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
        {currentUser, readAt: undefined}
      );

      expect(result).toBe(true);
    });

    it('is false for an event of the current user', () => {
      const result = isUnread(
        {creatorId: 42, createdAt: '2026-08-17T11:00:00.000Z'},
        {currentUser, readAt: undefined}
      );

      expect(result).toBe(false);
    });

    it('is false while the current user is unknown', () => {
      const result = isUnread(
        {creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'},
        {currentUser: null, readAt: undefined}
      );

      expect(result).toBe(false);
    });

    describe('with a baseline on the current user', () => {
      const joinedUser = {...currentUser, unreadCommentsSinceAt: '2026-08-17T10:00:00.000Z'};

      it('is false for an event from before the baseline', () => {
        const result = isUnread(
          {creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
          {currentUser: joinedUser, readAt: undefined}
        );

        expect(result).toBe(false);
      });

      it('is true for an event from after the baseline', () => {
        const result = isUnread(
          {creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'},
          {currentUser: joinedUser, readAt: undefined}
        );

        expect(result).toBe(true);
      });
    });
  });

  describe('useUnreadComments', () => {
    it('reads current user and read timestamp from review state', () => {
      const commentThread = {
        id: 1,
        permaId: 5,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [
          {id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
          {id: 101, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}
        ]
      };

      const {result} = renderHookWithReviewState(
        () => useUnreadActivity(commentThread),
        {
          currentUser,
          commentThreads: [commentThread],
          commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
        }
      );

      expect(result.current.map(comment => comment.id)).toEqual([101]);
    });

    it('returns nothing before review state has been fetched', () => {
      const commentThread = {
        id: 1,
        permaId: 5,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}]
      };

      const {result} = renderHookWithReviewState(
        () => useUnreadActivity(commentThread),
        {commentThreads: [commentThread]}
      );

      expect(result.current).toEqual([]);
    });
  });
});
