import {ReviewSession} from './ReviewSession';
import {request} from './request';

export {ReviewSession};

export function createReviewSession({entryId, initialState}) {
  const session = new ReviewSession({entryId, request, initialState});

  // Read marks are sent with a delay, which a tab closing right after
  // reading would otherwise cut short.
  window.addEventListener('pagehide', () => session.flushReads());

  return session;
}
