import React from 'react';
import {render, act} from '@testing-library/react';

import {ReviewStateProvider} from '../review/ReviewStateProvider';

export function renderWithReviewState(ui, {commentThreads = [], currentUser = null} = {}) {
  const result = render(
    <ReviewStateProvider>
      {ui}
    </ReviewStateProvider>
  );

  if (commentThreads.length > 0 || currentUser) {
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {currentUser, commentThreads}
        },
        origin: window.location.origin
      }));
    });
  }

  return result;
}
