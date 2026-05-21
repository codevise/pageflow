import React, {useEffect} from 'react';

import {useEntryMetadata} from 'pageflow-scrolled/entryState';
import {createReviewSession} from 'pageflow/review';
import {ReviewStateProvider, ReviewMessageHandler} from 'pageflow-scrolled/review';
import {AddCommentModeProvider} from './AddCommentModeProvider';
import {SelectedSubjectProvider} from './SelectedSubjectProvider';
import {FloatingToolbar} from './FloatingToolbar';

export function EntryDecorator({commentingInitialState, children}) {
  return (
    <ReviewStateProvider initialState={commentingInitialState}>
      <ReviewSessionSetup initialState={commentingInitialState} />
      <SelectedSubjectProvider>
        <AddCommentModeProvider>
          {children}
          <FloatingToolbar />
        </AddCommentModeProvider>
      </SelectedSubjectProvider>
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
