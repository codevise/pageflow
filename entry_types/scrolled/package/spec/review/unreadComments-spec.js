import {unreadComments, useUnreadComments} from 'review/unreadComments';
import {renderHookWithReviewState} from 'support/renderWithReviewState';

describe('unreadComments', () => {
  const currentUser = {id: 42, name: 'Alice'};

  function thread(comments) {
    return {id: 1, permaId: 5, comments};
  }

  it('returns comments created after read timestamp', () => {
    const result = unreadComments(
      thread([
        {id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
        {id: 101, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}
      ]),
      {currentUser, readAt: '2026-08-17T10:00:00.000Z'}
    );

    expect(result.map(comment => comment.id)).toEqual([101]);
  });

  it('returns all comments of never read thread', () => {
    const result = unreadComments(
      thread([
        {id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'},
        {id: 101, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}
      ]),
      {currentUser, readAt: undefined}
    );

    expect(result.map(comment => comment.id)).toEqual([100, 101]);
  });

  it('excludes comments of current user', () => {
    const result = unreadComments(
      thread([
        {id: 100, creatorId: 42, createdAt: '2026-08-17T11:00:00.000Z'},
        {id: 101, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}
      ]),
      {currentUser, readAt: undefined}
    );

    expect(result.map(comment => comment.id)).toEqual([101]);
  });

  it('returns nothing while current user is unknown', () => {
    const result = unreadComments(
      thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}]),
      {currentUser: null, readAt: undefined}
    );

    expect(result).toEqual([]);
  });

  describe('with a baseline on the current user', () => {
    const joinedUser = {...currentUser, unreadCommentsSinceAt: '2026-08-17T10:00:00.000Z'};

    it('ignores comments from before the baseline', () => {
      const result = unreadComments(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T09:00:00.000Z'}]),
        {currentUser: joinedUser, readAt: undefined}
      );

      expect(result).toEqual([]);
    });

    it('returns comments from after the baseline', () => {
      const result = unreadComments(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}]),
        {currentUser: joinedUser, readAt: undefined}
      );

      expect(result.map(comment => comment.id)).toEqual([100]);
    });

    // A thread read after the baseline has moved past it.
    it('prefers a later read timestamp over the baseline', () => {
      const result = unreadComments(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'}]),
        {currentUser: joinedUser, readAt: '2026-08-17T12:00:00.000Z'}
      );

      expect(result).toEqual([]);
    });

    // A thread last read before the baseline says nothing newer than it.
    it('prefers the baseline over an earlier read timestamp', () => {
      const result = unreadComments(
        thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T09:30:00.000Z'}]),
        {currentUser: joinedUser, readAt: '2026-08-17T09:00:00.000Z'}
      );

      expect(result).toEqual([]);
    });
  });

  it('compares timestamps of different time zone offsets', () => {
    const result = unreadComments(
      thread([{id: 100, creatorId: 43, createdAt: '2026-08-17T12:00:00.000+02:00'}]),
      {currentUser, readAt: '2026-08-17T11:00:00.000Z'}
    );

    expect(result).toEqual([]);
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
        () => useUnreadComments(commentThread),
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
        () => useUnreadComments(commentThread),
        {commentThreads: [commentThread]}
      );

      expect(result.current).toEqual([]);
    });
  });
});
