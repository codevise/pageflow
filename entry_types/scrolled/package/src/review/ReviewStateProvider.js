import React, {createContext, useContext, useEffect, useMemo, useReducer} from 'react';

const ReviewStateContext = createContext(null);

export function ReviewStateProvider({initialState, children}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
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
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const value = useMemo(() => ({
    currentUser: state.currentUser,
    commentThreads: Object.values(state.threads)
  }), [state]);

  return (
    <ReviewStateContext.Provider value={value}>
      {children}
    </ReviewStateContext.Provider>
  );
}

export function useCommentThreads(subject, {resolved} = {}) {
  const context = useContext(ReviewStateContext);
  const commentThreads = context ? context.commentThreads : [];
  const {subjectType, subjectId, subjectRange} = subject || {};

  return useMemo(() => {
    const rangeKey = subjectRange ? JSON.stringify(subjectRange) : undefined;

    return commentThreads.filter(
      thread => thread.subjectType === subjectType &&
                thread.subjectId === subjectId &&
                (!rangeKey ||
                 JSON.stringify(thread.subjectRange) === rangeKey) &&
                (resolved === undefined ||
                 (resolved === false && !thread.resolvedAt) ||
                 (resolved === true && !!thread.resolvedAt))
    );
  }, [commentThreads, subjectType, subjectId, subjectRange, resolved]);
}

function initState(initialState) {
  if (initialState) {
    return reducer({currentUser: null, threads: {}},
                   {type: 'RESET', payload: initialState});
  }

  return {currentUser: null, threads: {}};
}

function reducer(state, action) {
  switch (action.type) {
  case 'RESET': {
    const threads = {};
    action.payload.commentThreads.forEach(thread => {
      threads[thread.id] = thread;
    });

    return {
      currentUser: action.payload.currentUser,
      threads
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
