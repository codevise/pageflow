import React, {createContext, useContext, useRef} from 'react';

import {useCommentThreadReads, useCurrentUser} from './ReviewStateProvider';

const CommentThreadReadsSnapshotContext = createContext(null);

export function CommentThreadReadsSnapshot({enabled = true, resetOn, children}) {
  const outerSnapshot = useContext(CommentThreadReadsSnapshotContext);
  const liveReads = useCommentThreadReads();

  const currentUser = useCurrentUser();
  const snapshot = useRef(null);

  const lastResetOn = useRef(resetOn);

  if (resetOn !== lastResetOn.current) {
    lastResetOn.current = resetOn;
    snapshot.current = null;
  }

  if (!enabled) {
    snapshot.current = null;
  }
  else if (!snapshot.current && currentUser) {
    snapshot.current = liveReads;
  }

  return (
    <CommentThreadReadsSnapshotContext.Provider value={outerSnapshot || snapshot.current}>
      {children}
    </CommentThreadReadsSnapshotContext.Provider>
  );
}

export function useDisplayedCommentThreadReads() {
  const snapshot = useContext(CommentThreadReadsSnapshotContext);
  const liveReads = useCommentThreadReads();

  return snapshot || liveReads;
}
