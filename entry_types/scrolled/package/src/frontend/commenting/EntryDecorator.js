import React, {useEffect} from 'react';

import {useEntryMetadata} from 'pageflow-scrolled/entryState';
import {createReviewSession} from 'pageflow/review';
import {
  ReviewStateProvider,
  ReviewMessageHandler,
  LocatedCommentThreadsProvider,
  CommentDisplayFilterProvider,
  useStoredCommentDisplayFilter
} from 'pageflow-scrolled/review';
import {AddCommentModeProvider} from './AddCommentModeProvider';
import {CommentingVisibilityProvider} from './CommentingVisibilityProvider';
import {SelectedSubjectProvider} from './SelectedSubjectProvider';
import {FloatingToolbar} from './FloatingToolbar';

const resolutionStorageKey = 'pageflow.scrolled.commentsResolution';

export function EntryDecorator({commentingInitialState, children}) {
  const commentDisplayFilter = useStoredCommentDisplayFilter(resolutionStorageKey);

  return (
    <ReviewStateProvider initialState={commentingInitialState}>
      <ReviewSessionSetup initialState={commentingInitialState} />
      <LocatedCommentThreadsProvider>
        <CommentingVisibilityProvider>
          <CommentDisplayFilterProvider {...commentDisplayFilter}>
            <SelectedSubjectProvider>
              <AddCommentModeProvider>
                {children}
                <FloatingToolbar />
              </AddCommentModeProvider>
            </SelectedSubjectProvider>
          </CommentDisplayFilterProvider>
        </CommentingVisibilityProvider>
      </LocatedCommentThreadsProvider>
    </ReviewStateProvider>
  );
}

function ReviewSessionSetup({initialState}) {
  const entryMetadata = useEntryMetadata();
  const entryId = entryMetadata?.id;

  useEffect(() => {
    if (!entryId) return;

    const session = createReviewSession({entryId, initialState});
    const handler = ReviewMessageHandler.create({session, targetWindow: window});

    if (!initialState) {
      session.fetch();
    }

    return () => handler.dispose();
  }, [entryId, initialState]);

  return null;
}
