export function postCreateCommentThreadMessage({subjectType, subjectId, body}) {
  window.top.postMessage(
    {type: 'CREATE_COMMENT_THREAD', payload: {subjectType, subjectId, body}},
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
