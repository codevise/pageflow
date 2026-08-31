import React, {useCallback} from 'react';

import {useLocatedCommentThreadsForSubject} from './useLocatedCommentThreadsForSubject';
import {useUnreadActivityCount} from './unreadActivity';
import {Badge} from './Badge';

export function ThreadsBadge({subjectType, subjectId, subjectRange, onClick, mode, resolution = 'unresolved', revealedThreadId}) {
  const threads = useLocatedCommentThreadsForSubject({
    subjectType, subjectId, subjectRange, resolution, revealedThreadId
  });
  const unresolvedThreads =
    useLocatedCommentThreadsForSubject({subjectType, subjectId, subjectRange, resolution: 'unresolved'});

  const counted = threads.filter(thread => thread.id !== revealedThreadId);

  const unreadCount = useUnreadActivityCount(threads);

  const handleClick = useCallback(() => {
    if (onClick) onClick(threads);
  }, [onClick, threads]);

  const resolved = threads.length > 0 && unresolvedThreads.length === 0;

  return <Badge counter={counted.length}
                hasThreads={threads.length > 0}
                mode={mode}
                resolved={resolved}
                unreadCount={unreadCount}
                onClick={handleClick} />;
}
