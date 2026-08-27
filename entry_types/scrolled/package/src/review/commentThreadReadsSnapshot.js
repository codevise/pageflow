import React, {createContext, useContext, useRef} from 'react';

import {useCommentThreadReads, useCurrentUser} from './ReviewStateProvider';

const CommentThreadReadsSnapshotContext = createContext(null);

// Threads mark themselves read while they are on screen, so markers
// derived from live read state would disappear from under the reviewer
// mid-read. Displaying threads therefore freezes read state for as long
// as they are shown: markers hold still until the list goes away, and
// the next visit reflects what was read. Passing `resetOn` freezes anew
// whenever the value changes, for scopes that outlive what the reviewer
// is reading.
//
// Nesting reuses the outermost snapshot, so a list rendered inside an
// already frozen scope keeps that scope's idea of what is new.
export function CommentThreadReadsSnapshot({enabled = true, resetOn, children}) {
  const outerSnapshot = useContext(CommentThreadReadsSnapshotContext);
  const liveReads = useCommentThreadReads();

  // Read state only means anything once the current user is known.
  // Freezing before that would keep every thread marked new.
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

// Read state to derive markers from. Falls back to live state where
// nothing has been frozen.
export function useDisplayedCommentThreadReads() {
  const snapshot = useContext(CommentThreadReadsSnapshotContext);
  const liveReads = useCommentThreadReads();

  return snapshot || liveReads;
}
