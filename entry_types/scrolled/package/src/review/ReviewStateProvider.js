import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer
} from 'react';

import {useSectionPermaIdOfSubject} from 'pageflow-scrolled/entryState';

import {
  postCreateCommentMessage,
  postCreateCommentThreadMessage,
  postMarkThreadsReadMessage,
  postSetCommentDraftMessage,
  postUpdateCommentMessage
} from './postMessage';
import {useSubjectQuote} from './subjectQuote';

const ReviewStateContext = createContext(null);
const CommentDraftsContext = createContext(null);
const CommentThreadReadsContext = createContext(null);

// Kept stable so consumers outside the provider do not see a new object
// on every render.
const emptyCommentThreadReads = {};

export function ReviewStateProvider({initialState, initialDrafts, setDraft, children}) {
  const [state, dispatch] = useReducer(
    reducer,
    {initialState, initialDrafts},
    initState
  );

  useEffect(() => {
    function handleMessage(event) {
      if (window.location.href.indexOf(event.origin) !== 0) return;

      const {type, payload} = event.data;

      if (type === 'REVIEW_STATE_RESET') {
        dispatch({type: 'RESET', payload});
      }
      else if (type === 'REVIEW_STATE_THREAD_CHANGE') {
        dispatch({type: 'UPSERT_THREAD', payload});
      }
      else if (type === 'REVIEW_STATE_DRAFTS_CHANGE') {
        dispatch({type: 'SET_DRAFTS', payload});
      }
      else if (type === 'REVIEW_STATE_READS_CHANGE') {
        dispatch({type: 'SET_READS', payload});
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Drafts live in their own context so that storing one does not
  // invalidate the thread state consumers derive their lists from.
  const value = useMemo(() => ({
    currentUser: state.currentUser,
    commentThreads: Object.values(state.threads)
  }), [state.currentUser, state.threads]);

  // Marking the draft pending rather than waiting for the session to
  // report it back keeps the form in one state from the submit onwards:
  // shown, disabled and holding the text.
  const createThread = useCallback(payload => {
    const {subjectType, subjectId, body} = payload;

    dispatch({type: 'SET_DRAFT', payload: {
      subjectType, subjectId, body, pending: true
    }});

    postCreateCommentThreadMessage(payload);
  }, []);

  const createComment = useCallback(payload => {
    const {threadId, body} = payload;

    dispatch({type: 'SET_DRAFT', payload: {threadId, body, pending: true}});

    postCreateCommentMessage(payload);
  }, []);

  // The editor sidebar passes a direct write instead of relying on the
  // message: its ReviewMessageHandler is disposed together with the view,
  // which would drop the draft stored while the view is going away.
  const draftsValue = useMemo(() => ({
    drafts: state.drafts,
    setDraft: setDraft || postSetCommentDraftMessage,
    createThread,
    createComment
  }), [state.drafts, setDraft, createThread, createComment]);

  // Kept stable across read state changes: consumers wait for a thread
  // to stay visible before marking it read, which a changing callback
  // would start over.
  const markThreadRead = useCallback(
    permaId => postMarkThreadsReadMessage([permaId]),
    []
  );

  // Read marks arrive whenever a thread is displayed, so they get their
  // own context to keep thread lists from rerendering along with them.
  const readsValue = useMemo(() => ({
    commentThreadReads: state.commentThreadReads,
    markThreadRead
  }), [state.commentThreadReads, markThreadRead]);

  return (
    <ReviewStateContext.Provider value={value}>
      <CommentDraftsContext.Provider value={draftsValue}>
        <CommentThreadReadsContext.Provider value={readsValue}>
          {children}
        </CommentThreadReadsContext.Provider>
      </CommentDraftsContext.Provider>
    </ReviewStateContext.Provider>
  );
}

export function useCommentDraft({threadId, subjectType, subjectId}) {
  const {drafts, setDraft} = useContext(CommentDraftsContext);

  return [
    drafts[draftKey({threadId, subjectType, subjectId})],
    useCallback(
      body => setDraft(threadId ? {threadId, body} : {subjectType, subjectId, body}),
      [setDraft, threadId, subjectType, subjectId]
    )
  ];
}

export function useCreateCommentThread({subjectType, subjectId, subjectRange}) {
  const {createThread} = useContext(CommentDraftsContext);

  const sectionPermaId = useSectionPermaIdOfSubject({subjectType, subjectId});

  // Recorded now since the commented text can change afterwards, leaving the
  // comment without the wording it referred to.
  const quote = useSubjectQuote({subjectType, subjectId, subjectRange});

  return useCallback(body => createThread({
    subjectType, subjectId, subjectRange, sectionPermaId, body, quote
  }), [createThread, subjectType, subjectId, subjectRange, sectionPermaId, quote]);
}

export function useCreateComment({threadId, subjectType, subjectId, subjectRange}) {
  const {createComment} = useContext(CommentDraftsContext);

  // Each reply records the wording it responds to, so a thread spanning
  // several edits keeps every comment next to its own version of the text.
  const quote = useSubjectQuote({subjectType, subjectId, subjectRange});

  return useCallback(body => createComment({threadId, body, quote}),
                     [createComment, threadId, quote]);
}

// Edits are not drafted, so this posts straight through rather than going
// through the draft context the create hooks share.
export function useUpdateComment({threadId, commentId}) {
  return useCallback(
    body => postUpdateCommentMessage({threadId, commentId, body}),
    [threadId, commentId]
  );
}

export function useCurrentUser() {
  const context = useContext(ReviewStateContext);
  return context ? context.currentUser : null;
}

export function useCommentThreadReads() {
  const context = useContext(CommentThreadReadsContext);
  return context ? context.commentThreadReads : emptyCommentThreadReads;
}

export function useMarkThreadRead() {
  const context = useContext(CommentThreadReadsContext);
  return context?.markThreadRead;
}

export function useCommentThread(threadId) {
  const context = useContext(ReviewStateContext);
  return context?.commentThreads.find(t => t.id === threadId);
}

export function useCommentThreads({subjectType, subjectId, subjectRange, resolution = 'all'} = {}) {
  const context = useContext(ReviewStateContext);
  const commentThreads = context ? context.commentThreads : [];
  const hasSubject = subjectType !== undefined;

  return useMemo(() => {
    const rangeKey = subjectRange ? JSON.stringify(subjectRange) : undefined;

    return commentThreads.filter(
      thread => (!hasSubject ||
                 (thread.subjectType === subjectType &&
                  thread.subjectId === subjectId &&
                  (!rangeKey ||
                   JSON.stringify(thread.subjectRange) === rangeKey))) &&
                matchesResolution(thread, resolution)
    );
  }, [commentThreads, hasSubject, subjectType, subjectId, subjectRange, resolution]);
}

export function matchesResolution(thread, resolution) {
  return resolution === 'all' ||
         (resolution === 'unresolved' && !thread.resolvedAt) ||
         (resolution === 'resolved' && !!thread.resolvedAt);
}

function initState({initialState, initialDrafts}) {
  const empty = {
    currentUser: null,
    threads: {},
    drafts: initialDrafts || {},
    commentThreadReads: {}
  };

  if (initialState) {
    return reducer(empty, {type: 'RESET', payload: initialState});
  }

  return empty;
}

function reducer(state, action) {
  switch (action.type) {
  case 'RESET': {
    const threads = {};
    action.payload.commentThreads.forEach(thread => {
      threads[thread.id] = thread;
    });

    // Refetching threads leaves unsent drafts untouched.
    return {
      ...state,
      currentUser: action.payload.currentUser,
      threads,
      commentThreadReads: action.payload.commentThreadReads || {}
    };
  }
  case 'SET_READS':
    return {
      ...state,
      commentThreadReads: action.payload
    };
  case 'SET_DRAFTS':
    return {
      ...state,
      drafts: action.payload
    };
  case 'SET_DRAFT':
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [draftKey(action.payload)]: action.payload
      }
    };
  case 'UPSERT_THREAD':
    return {
      ...state,
      threads: {
        ...state.threads,
        [action.payload.id]: action.payload
      }
    };
  default:
    return state;
  }
}

// Replies are drafted per thread, new threads per subject.
function draftKey({threadId, subjectType, subjectId}) {
  return threadId ? `Thread:${threadId}` : `${subjectType}:${subjectId}`;
}
