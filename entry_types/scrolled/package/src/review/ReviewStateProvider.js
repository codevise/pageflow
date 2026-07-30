import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer
} from 'react';

import {useSectionPermaIdOfSubject} from 'pageflow-scrolled/entryState';

import {
  postCreateCommentThreadMessage,
  postSetCommentDraftMessage
} from './postMessage';
import {useSubjectQuote} from './subjectQuote';

const ReviewStateContext = createContext(null);
const CommentDraftsContext = createContext(null);

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

  // The editor sidebar passes a direct write instead of relying on the
  // message: its ReviewMessageHandler is disposed together with the view,
  // which would drop the draft stored while the view is going away.
  const draftsValue = useMemo(() => ({
    drafts: state.drafts,
    setDraft: setDraft || postSetCommentDraftMessage,
    createThread
  }), [state.drafts, setDraft, createThread]);

  return (
    <ReviewStateContext.Provider value={value}>
      <CommentDraftsContext.Provider value={draftsValue}>
        {children}
      </CommentDraftsContext.Provider>
    </ReviewStateContext.Provider>
  );
}

export function useCommentDraft({subjectType, subjectId}) {
  const {drafts, setDraft} = useContext(CommentDraftsContext);

  return [
    drafts[`${subjectType}:${subjectId}`],
    useCallback(body => setDraft({subjectType, subjectId, body}),
                [setDraft, subjectType, subjectId])
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
  const empty = {currentUser: null, threads: {}, drafts: initialDrafts || {}};

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
      threads
    };
  }
  case 'SET_DRAFTS':
    return {
      ...state,
      drafts: action.payload
    };
  case 'SET_DRAFT': {
    const {subjectType, subjectId} = action.payload;

    return {
      ...state,
      drafts: {
        ...state.drafts,
        [`${subjectType}:${subjectId}`]: action.payload
      }
    };
  }
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
