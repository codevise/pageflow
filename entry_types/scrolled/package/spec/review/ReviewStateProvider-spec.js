import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {act} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';

import {
  ReviewStateProvider,
  useCommentDraft,
  useCommentThread,
  useCommentThreadReads,
  useCommentThreads,
  useCreateComment,
  useCreateCommentThread,
  useCurrentUser,
  useMarkThreadRead,
  useUpdateComment
} from 'review/ReviewStateProvider';
import {
  postReviewStateResetMessage,
  postReviewStateThreadChangeMessage,
  postReviewStateDraftsChangeMessage,
  postReviewStateReadsChangeMessage
} from 'review/postMessage';
import {renderHookWithReviewState} from 'support/renderWithReviewState';

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

  it('returns all threads when no subject is given', () => {
    const {result} = renderHook(
      () => useCommentThreads(),
      {
        wrapper: ({children}) => (
          <ReviewStateProvider initialState={{
            currentUser: null,
            commentThreads: [
              {id: 1, subjectType: 'CE', subjectId: 10, comments: []},
              {id: 2, subjectType: 'Section', subjectId: 20, comments: []}
            ]
          }}>
            {children}
          </ReviewStateProvider>
        )
      }
    );

    expect(result.current.map(t => t.id)).toEqual([1, 2]);
  });

  it('filters all threads by resolution when no subject is given', () => {
    const {result} = renderHook(
      () => useCommentThreads({resolution: 'unresolved'}),
      {
        wrapper: ({children}) => (
          <ReviewStateProvider initialState={{
            currentUser: null,
            commentThreads: [
              {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []},
              {id: 2, subjectType: 'Section', subjectId: 20, resolvedAt: '2026-04-09', comments: []},
              {id: 3, subjectType: 'CE', subjectId: 30, resolvedAt: null, comments: []}
            ]
          }}>
            {children}
          </ReviewStateProvider>
        )
      }
    );

    expect(result.current.map(t => t.id)).toEqual([1, 3]);
  });

  it('filters by resolution unresolved', () => {
    const {result} = renderHook(
      () => useCommentThreads({subjectType: 'CE', subjectId: 10, resolution: 'unresolved'}),
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

  it('filters by resolution resolved', () => {
    const {result} = renderHook(
      () => useCommentThreads({subjectType: 'CE', subjectId: 10, resolution: 'resolved'}),
      {
        wrapper: ({children}) => (
          <ReviewStateProvider initialState={{
            currentUser: null,
            commentThreads: [
              {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []},
              {id: 2, subjectType: 'CE', subjectId: 10, resolvedAt: '2026-04-09', comments: []},
              {id: 3, subjectType: 'CE', subjectId: 10, resolvedAt: '2026-04-10', comments: []}
            ]
          }}>
            {children}
          </ReviewStateProvider>
        )
      }
    );

    expect(result.current.map(t => t.id)).toEqual([2, 3]);
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

  describe('useCommentDraft', () => {
    const draft = {
      subjectType: 'CE', subjectId: 10, body: 'Half a thought', pending: false
    };

    function renderDraftHook({initialDrafts, setDraft} = {}) {
      return renderHook(
        () => useCommentDraft({subjectType: 'CE', subjectId: 10}),
        {
          wrapper: ({children}) => (
            <ReviewStateProvider initialDrafts={initialDrafts} setDraft={setDraft}>
              {children}
            </ReviewStateProvider>
          )
        }
      );
    }

    it('returns undefined without a draft for the subject', () => {
      const {result} = renderDraftHook();

      expect(result.current[0]).toBeUndefined();
    });

    it('returns drafts passed as initial drafts', () => {
      const {result} = renderDraftHook({initialDrafts: {'CE:10': draft}});

      expect(result.current[0]).toEqual(draft);
    });

    it('updates on drafts change message', async () => {
      const {result, waitForNextUpdate} = renderDraftHook();

      act(() => {
        postReviewStateDraftsChangeMessage(window, {'CE:10': draft});
      });
      await waitForNextUpdate();

      expect(result.current[0]).toEqual(draft);
    });

    it('stores a draft for the subject by posting a message', () => {
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {result} = renderDraftHook();

      result.current[1]('Half a thought');

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'SET_COMMENT_DRAFT',
          payload: {subjectType: 'CE', subjectId: 10, body: 'Half a thought'}
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('stores a draft through the function passed to the provider instead', () => {
      const setDraft = jest.fn();

      const {result} = renderDraftHook({setDraft});

      result.current[1]('Half a thought');

      expect(setDraft).toHaveBeenCalledWith({
        subjectType: 'CE', subjectId: 10, body: 'Half a thought'
      });
    });

    it('keeps drafts on reset message', async () => {
      const {result, waitForNextUpdate} = renderHook(
        () => ({
          draft: useCommentDraft({subjectType: 'CE', subjectId: 10})[0],
          threads: useCommentThreads()
        }),
        {
          wrapper: ({children}) => (
            <ReviewStateProvider initialDrafts={{'CE:10': draft}}>
              {children}
            </ReviewStateProvider>
          )
        }
      );

      postReset({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [{id: 1, subjectType: 'CE', subjectId: 10, comments: []}]
      });
      await waitForNextUpdate();

      expect(result.current.threads).toHaveLength(1);
      expect(result.current.draft).toEqual(draft);
    });
  });

  describe('useCommentDraft of a thread', () => {
    const draft = {threadId: 7, body: 'Half a reply', pending: false};

    it('returns the draft stored for the thread', () => {
      const {result} = renderHook(() => useCommentDraft({threadId: 7}), {
        wrapper: ({children}) => (
          <ReviewStateProvider initialDrafts={{'Thread:7': draft}}>
            {children}
          </ReviewStateProvider>
        )
      });

      expect(result.current[0]).toEqual(draft);
    });

    it('stores a draft for the thread', () => {
      const setDraft = jest.fn();

      const {result} = renderHook(() => useCommentDraft({threadId: 7}), {
        wrapper: ({children}) => (
          <ReviewStateProvider setDraft={setDraft}>{children}</ReviewStateProvider>
        )
      });

      result.current[1]('Half a reply');

      expect(setDraft).toHaveBeenCalledWith({threadId: 7, body: 'Half a reply'});
    });
  });

  describe('useCreateComment', () => {
    const seed = {
      sections: [{id: 1, permaId: 7}],
      contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
    };

    function renderCreateHook() {
      return renderHookWithReviewState(
        () => ({
          createComment: useCreateComment({
            threadId: 7, subjectType: 'ContentElement', subjectId: 10
          }),
          draft: useCommentDraft({threadId: 7})[0]
        }),
        {seed}
      );
    }

    it('marks the draft of the thread pending right away', () => {
      const {result} = renderCreateHook();

      act(() => result.current.createComment('A reply'));

      expect(result.current.draft).toEqual({
        threadId: 7, body: 'A reply', pending: true
      });
    });

    it('posts a create comment message', () => {
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {result} = renderCreateHook();

      act(() => result.current.createComment('A reply'));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'CREATE_COMMENT',
          payload: expect.objectContaining({threadId: 7, body: 'A reply'})
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });
  });

  describe('useUpdateComment', () => {
    it('posts an update comment message', () => {
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {result} = renderHookWithReviewState(
        () => useUpdateComment({threadId: 7, commentId: 100})
      );

      act(() => result.current('Fixed'));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'UPDATE_COMMENT',
          payload: {threadId: 7, commentId: 100, body: 'Fixed'}
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    // Edits are not drafted, so nothing may end up in the reply draft of
    // the thread the edited comment belongs to.
    it('leaves the draft of the thread untouched', () => {
      jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {result} = renderHookWithReviewState(
        () => ({
          updateComment: useUpdateComment({threadId: 7, commentId: 100}),
          draft: useCommentDraft({threadId: 7})[0]
        })
      );

      act(() => result.current.updateComment('Fixed'));

      expect(result.current.draft).toBeUndefined();

      window.top.postMessage.mockRestore();
    });
  });

  describe('useCurrentUser', () => {
    it('provides the user reported by the session', async () => {
      const {result, waitForNextUpdate} = renderHook(() => useCurrentUser(), {wrapper});

      postReset({currentUser: {id: 42, name: 'Alice'}, commentThreads: []});
      await waitForNextUpdate();

      expect(result.current).toEqual({id: 42, name: 'Alice'});
    });

    it('is null before the session has reported', () => {
      const {result} = renderHook(() => useCurrentUser(), {wrapper});

      expect(result.current).toBeNull();
    });
  });

  // Assembling the payload needs the entry structure the subject lives in.
  describe('useCreateCommentThread', () => {
    const seed = {
      sections: [{id: 1, permaId: 7}],
      contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
    };

    function renderCreateHook({drafts} = {}) {
      return renderHookWithReviewState(
        () => ({
          createThread: useCreateCommentThread({
            subjectType: 'ContentElement', subjectId: 10
          }),
          draft: useCommentDraft({subjectType: 'ContentElement', subjectId: 10})[0],
          other: useCommentDraft({subjectType: 'ContentElement', subjectId: 20})[0]
        }),
        {seed, drafts}
      );
    }

    it('marks the draft of the subject pending right away', () => {
      const {result} = renderCreateHook();

      act(() => result.current.createThread('Looks good'));

      expect(result.current.draft).toEqual({
        subjectType: 'ContentElement',
        subjectId: 10,
        body: 'Looks good',
        pending: true
      });
    });

    it('posts a create thread message with the section of the subject', () => {
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {result} = renderCreateHook();

      act(() => result.current.createThread('Looks good'));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'CREATE_COMMENT_THREAD',
          payload: expect.objectContaining({
            subjectType: 'ContentElement',
            subjectId: 10,
            sectionPermaId: 7,
            body: 'Looks good'
          })
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('keeps drafts of other subjects', () => {
      const {result} = renderCreateHook({
        drafts: {
          'ContentElement:20': {
            subjectType: 'ContentElement', subjectId: 20, body: 'Elsewhere', pending: false
          }
        }
      });

      act(() => result.current.createThread('Looks good'));

      expect(result.current.other).toMatchObject({body: 'Elsewhere'});
    });
  });

  describe('comment thread reads', () => {
    function postReadsChange(payload) {
      act(() => {
        postReviewStateReadsChangeMessage(window, payload);
      });
    }

    it('provides no read timestamp initially', () => {
      const {result} = renderHook(() => useCommentThreadReads()[5], {wrapper});

      expect(result.current).toBeUndefined();
    });

    it('provides read timestamp from reset message', async () => {
      const {result, waitForNextUpdate} = renderHook(
        () => useCommentThreadReads()[5],
        {wrapper}
      );

      postReset({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [],
        commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
      });
      await waitForNextUpdate();

      expect(result.current).toEqual('2026-08-17T10:00:00.000Z');
    });

    it('updates read timestamp on reads change message', async () => {
      const {result, waitForNextUpdate} = renderHook(
        () => useCommentThreadReads()[5],
        {wrapper}
      );

      postReadsChange({5: '2026-08-17T12:00:00.000Z'});
      await waitForNextUpdate();

      expect(result.current).toEqual('2026-08-17T12:00:00.000Z');
    });

    it('marks thread read by posting a message', () => {
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {result} = renderHook(() => useMarkThreadRead(), {wrapper});

      result.current(5);

      expect(postMessage).toHaveBeenCalledWith(
        {type: 'MARK_THREADS_READ', payload: {permaIds: [5]}},
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('keeps mark callback stable when reads change', async () => {
      const {result, waitForNextUpdate} = renderHook(() => useMarkThreadRead(), {wrapper});

      const markThreadRead = result.current;
      postReadsChange({5: '2026-08-17T12:00:00.000Z'});
      await waitForNextUpdate();

      expect(result.current).toBe(markThreadRead);
    });

    it('does not invalidate thread state when reads change', async () => {
      const {result, waitForNextUpdate} = renderHook(
        () => useCommentThreads(),
        {wrapper}
      );

      postReset({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [{id: 1, permaId: 5, subjectType: 'CE', subjectId: 10, comments: []}],
        commentThreadReads: {}
      });
      await waitForNextUpdate();

      const threadsBefore = result.current;
      postReadsChange({5: '2026-08-17T12:00:00.000Z'});

      expect(result.current).toBe(threadsBefore);
    });
  });
});
