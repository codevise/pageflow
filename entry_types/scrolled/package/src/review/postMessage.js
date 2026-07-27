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
