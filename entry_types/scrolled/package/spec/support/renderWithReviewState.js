import React from 'react';

import {renderInEntry, renderHookInEntry} from 'pageflow-scrolled/testHelpers';
import {ReviewStateProvider} from 'review/ReviewStateProvider';
import {LocatedCommentThreadsProvider} from 'review/useLocatedCommentThreads';

// Renders src/review/ UI within entry state plus ReviewStateProvider.
// Review UI resolves entry structure (e.g. the section a comment subject
// lives in), so it needs the entry scope just like any other frontend
// component — review state is layered on top via the entry helper's
// `wrapper` option.
export function renderWithReviewState(ui, {commentThreads = [], commentThreadReads = {}, currentUser = null, drafts, setDraft, seed = {}} = {}) {
  return renderInEntry(ui, {
    seed,
    wrapper: reviewStateWrapper({commentThreads, commentThreadReads, currentUser, drafts, setDraft})
  });
}

// Counterpart for selector hooks that read entry state and review state.
export function renderHookWithReviewState(hook, {commentThreads = [], commentThreadReads = {}, currentUser = null, drafts, setDraft, seed = {}} = {}) {
  return renderHookInEntry(hook, {
    seed,
    wrapper: reviewStateWrapper({commentThreads, commentThreadReads, currentUser, drafts, setDraft})
  });
}

function reviewStateWrapper({commentThreads = [], commentThreadReads = {}, currentUser = null, drafts, setDraft} = {}) {
  return function ReviewStateWrapper({children}) {
    return (
      <ReviewStateProvider initialState={{currentUser, commentThreads, commentThreadReads}}
                           initialDrafts={drafts}
                           setDraft={setDraft}>
        <LocatedCommentThreadsProvider>
          {children}
        </LocatedCommentThreadsProvider>
      </ReviewStateProvider>
    );
  };
}
