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
