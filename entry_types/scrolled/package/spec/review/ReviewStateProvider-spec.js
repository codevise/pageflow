import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {act} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';

import {
  ReviewStateProvider,
  useCommentThread,
  useCommentThreads
} from 'review/ReviewStateProvider';
import {
  postReviewStateResetMessage,
  postReviewStateThreadChangeMessage
} from 'review/postMessage';

function wrapper({children}) {
  return <ReviewStateProvider>{children}</ReviewStateProvider>;
}

function postReset(payload) {
  act(() => {
    postReviewStateResetMessage(window, payload);
  });
}

function postThreadChange(payload) {
  act(() => {
    postReviewStateThreadChangeMessage(window, payload);
  });
}

describe('ReviewStateProvider', () => {
  it('provides empty initial state', () => {
    const {result} = renderHook(
      () => useCommentThreads({subjectType: 'CE', subjectId: 10}),
      {wrapper}
    );

    expect(result.current).toEqual([]);
  });

  it('updates state on reset message', async () => {
    const {result, waitForNextUpdate} = renderHook(
      () => useCommentThreads({subjectType: 'CE', subjectId: 10}),
      {wrapper}
    );

    postReset({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        {id: 1, subjectType: 'CE', subjectId: 10, comments: []},
        {id: 2, subjectType: 'CE', subjectId: 20, comments: []}
      ]
    });

    await waitForNextUpdate();

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe(1);
  });

  it('filters by resolved option', () => {
    const {result} = renderHook(
      () => useCommentThreads({subjectType: 'CE', subjectId: 10}, {resolved: false}),
      {
        wrapper: ({children}) => (
          <ReviewStateProvider initialState={{
            currentUser: null,
            commentThreads: [
              {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []},
              {id: 2, subjectType: 'CE', subjectId: 10, resolvedAt: '2026-04-09', comments: []},
              {id: 3, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []}
            ]
          }}>
            {children}
          </ReviewStateProvider>
        )
      }
    );

    expect(result.current).toHaveLength(2);
    expect(result.current.map(t => t.id)).toEqual([1, 3]);
  });

  it('updates single thread on thread change message', async () => {
    const {result, waitForNextUpdate} = renderHook(
      () => useCommentThreads({subjectType: 'CE', subjectId: 10}),
      {wrapper}
    );

    postReset({
      currentUser: {id: 42},
      commentThreads: [
        {id: 1, subjectType: 'CE', subjectId: 10, comments: []}
      ]
    });

    await waitForNextUpdate();
    expect(result.current[0].comments).toHaveLength(0);

    postThreadChange({
      id: 1,
      subjectType: 'CE',
      subjectId: 10,
      comments: [{id: 100, body: 'Hello'}]
    });

    await waitForNextUpdate();
    expect(result.current[0].comments).toHaveLength(1);
  });

  it('ignores messages from different origins', () => {
    const {result} = renderHook(
      () => useCommentThreads({subjectType: 'CE', subjectId: 10}),
      {wrapper}
    );

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {
            currentUser: {id: 99},
            commentThreads: [{id: 1, subjectType: 'CE', subjectId: 10, comments: []}]
          }
        },
        origin: 'https://evil.example.com'
      }));
    });

    expect(result.current).toEqual([]);
  });

  describe('useCommentThread', () => {
    it('returns the thread with the given id', () => {
      const {result} = renderHook(
        () => useCommentThread(2),
        {
          wrapper: ({children}) => (
            <ReviewStateProvider initialState={{
              currentUser: null,
              commentThreads: [
                {id: 1, subjectType: 'CE', subjectId: 10, comments: []},
                {id: 2, subjectType: 'CE', subjectId: 10,
                 comments: [{id: 100, body: 'Hello'}]}
              ]
            }}>
              {children}
            </ReviewStateProvider>
          )
        }
      );

      expect(result.current).toMatchObject({id: 2, comments: [{body: 'Hello'}]});
    });

    it('returns undefined for unknown thread id', () => {
      const {result} = renderHook(
        () => useCommentThread(999),
        {
          wrapper: ({children}) => (
            <ReviewStateProvider initialState={{
              currentUser: null,
              commentThreads: [
                {id: 1, subjectType: 'CE', subjectId: 10, comments: []}
              ]
            }}>
              {children}
            </ReviewStateProvider>
          )
        }
      );

      expect(result.current).toBeUndefined();
    });
  });
});
