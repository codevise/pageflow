export function postCreateCommentThreadMessage({
  subjectType, subjectId, subjectRange, sectionPermaId, body, quote
}) {
  window.top.postMessage(
    {
      type: 'CREATE_COMMENT_THREAD',
      payload: {subjectType, subjectId, subjectRange, sectionPermaId, body, quote}
    },
    window.location.origin
  );
}

export function postCreateCommentMessage({threadId, body, quote}) {
  window.top.postMessage(
    {type: 'CREATE_COMMENT', payload: {threadId, body, quote}},
    window.location.origin
  );
}

export function postUpdateCommentMessage({threadId, commentId, body}) {
  window.top.postMessage(
    {type: 'UPDATE_COMMENT', payload: {threadId, commentId, body}},
    window.location.origin
  );
}

export function postSetCommentDraftMessage(draft) {
  window.top.postMessage(
    {type: 'SET_COMMENT_DRAFT', payload: draft},
    window.location.origin
  );
}

export function postUpdateThreadMessage({threadId, resolved}) {
  window.top.postMessage(
    {type: 'UPDATE_THREAD', payload: {threadId, resolved}},
    window.location.origin
  );
}

export function postReviewStateResetMessage(targetWindow, state) {
  targetWindow.postMessage(
    {type: 'REVIEW_STATE_RESET', payload: state},
    window.location.origin
  );
}

export function postReviewStateThreadChangeMessage(targetWindow, thread) {
  targetWindow.postMessage(
    {type: 'REVIEW_STATE_THREAD_CHANGE', payload: thread},
    window.location.origin
  );
}

export function postReviewStateDraftsChangeMessage(targetWindow, drafts) {
  targetWindow.postMessage(
    {type: 'REVIEW_STATE_DRAFTS_CHANGE', payload: drafts},
    window.location.origin
  );
}
