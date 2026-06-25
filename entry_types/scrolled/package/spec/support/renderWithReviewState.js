import React from 'react';

import {renderInEntry, renderHookInEntry} from 'pageflow-scrolled/testHelpers';
import {ReviewStateProvider} from 'review/ReviewStateProvider';

// Renders src/review/ UI within entry state plus ReviewStateProvider.
// Review UI resolves entry structure (e.g. the section a comment subject
// lives in), so it needs the entry scope just like any other frontend
// component — review state is layered on top via the entry helper's
// `wrapper` option.
export function renderWithReviewState(ui, {commentThreads = [], currentUser = null, seed = {}} = {}) {
  return renderInEntry(ui, {
    seed,
    wrapper: reviewStateWrapper({commentThreads, currentUser})
  });
}

// Counterpart for selector hooks that read entry state and review state.
export function renderHookWithReviewState(hook, {commentThreads = [], currentUser = null, seed = {}} = {}) {
  return renderHookInEntry(hook, {
    seed,
    wrapper: reviewStateWrapper({commentThreads, currentUser})
  });
}

function reviewStateWrapper({commentThreads = [], currentUser = null} = {}) {
  return function ReviewStateWrapper({children}) {
    return (
      <ReviewStateProvider initialState={{currentUser, commentThreads}}>
        {children}
      </ReviewStateProvider>
    );
  };
}
