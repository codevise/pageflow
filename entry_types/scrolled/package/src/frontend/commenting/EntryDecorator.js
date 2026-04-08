import React, {useEffect} from 'react';

import {useEntryMetadata} from '../../entryState';
import {createReviewSession} from 'pageflow/review';
import {ReviewStateProvider, ReviewMessageHandler} from 'pageflow-scrolled/review';
import {AddCommentModeProvider} from './AddCommentModeProvider';
import {SelectedSubjectProvider} from './SelectedSubjectProvider';
import {FloatingToolbar} from './FloatingToolbar';

export function EntryDecorator(props) {
  return (
    <ReviewStateProvider>
      <ReviewSessionSetup />
      <SelectedSubjectProvider>
        <AddCommentModeProvider>
          {props.children}
          <FloatingToolbar />
        </AddCommentModeProvider>
      </SelectedSubjectProvider>
    </ReviewStateProvider>
  );
}

function ReviewSessionSetup() {
  const entryMetadata = useEntryMetadata();
  const entryId = entryMetadata?.id;

  useEffect(() => {
    if (!entryId) return;

    const session = createReviewSession({entryId});
    const handler = ReviewMessageHandler.create({session, targetWindow: window});

    session.fetch();

    return () => handler.dispose();
  }, [entryId]);

  return null;
}
