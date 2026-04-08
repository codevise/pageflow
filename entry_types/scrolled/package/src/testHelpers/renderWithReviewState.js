import React from 'react';
import {render} from '@testing-library/react';

import {ReviewStateProvider} from '../review/ReviewStateProvider';

export function renderWithReviewState(ui, {commentThreads = [], currentUser = null} = {}) {
  return render(
    <ReviewStateProvider initialState={{currentUser, commentThreads}}>
      {ui}
    </ReviewStateProvider>
  );
}
