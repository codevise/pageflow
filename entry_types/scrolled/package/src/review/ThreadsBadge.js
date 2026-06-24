import React, {useCallback} from 'react';

import {useCommentThreads} from './ReviewStateProvider';
import {Badge} from './Badge';

export function ThreadsBadge({subjectType, subjectId, subjectRange, onClick, mode, resolution = 'unresolved'}) {
  const threads = useCommentThreads({subjectType, subjectId, subjectRange, resolution});
  const unresolvedThreads = useCommentThreads({subjectType, subjectId, subjectRange, resolution: 'unresolved'});

  const handleClick = useCallback(() => {
    if (onClick) onClick(threads);
  }, [onClick, threads]);

  const resolved = threads.length > 0 && unresolvedThreads.length === 0;

  return <Badge counter={threads.length} mode={mode} resolved={resolved} onClick={handleClick} />;
}
