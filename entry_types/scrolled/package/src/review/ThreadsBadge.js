import React, {useCallback, useRef} from 'react';

import {usePostMessageListener} from '../shared/usePostMessageListener';
import {useCommentThreads} from './ReviewStateProvider';
import {Badge} from './Badge';

export function ThreadsBadge({subjectType, subjectId, subjectRange, onClick, onSelectThread, mode}) {
  const threads = useCommentThreads({subjectType, subjectId, subjectRange}, {resolved: false});
  const ref = useRef();

  const handleClick = useCallback(() => {
    if (onClick) onClick(threads);
  }, [onClick, threads]);

  return (
    <>
      {threads.length > 0 &&
        <SelectThreadListener threads={threads}
                              badgeRef={ref}
                              onSelectThread={onSelectThread} />}
      <Badge ref={ref} counter={threads.length} mode={mode} onClick={handleClick} />
    </>
  );
}

// Side-effect-only host for the SELECT_COMMENT_THREAD listener. Only
// rendered while the badge has threads, so the listener never attaches
// for empty badges. Returns null because all the work happens in the
// effect.
function SelectThreadListener({threads, badgeRef, onSelectThread}) {
  usePostMessageListener(useCallback(data => {
    if (data.type !== 'SELECT_COMMENT_THREAD') return;
    const threadId = data.payload.threadId;
    if (!threads.some(t => t.id === threadId)) return;

    // Prefer scrolling an enclosing selectable (e.g. SelectionRect with
    // aria-selected) into view so the user sees surrounding context,
    // not just the badge anchored at the side.
    const scrollTarget = badgeRef.current?.closest('[aria-selected]') || badgeRef.current;
    if (scrollTarget) scrollTarget.scrollIntoView({block: 'nearest', behavior: 'smooth'});

    if (onSelectThread) onSelectThread(threadId);
  }, [threads, badgeRef, onSelectThread]));

  return null;
}
