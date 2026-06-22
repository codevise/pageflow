import React, {useCallback} from 'react';

import {useCommentThreads} from './ReviewStateProvider';
import {Badge} from './Badge';

export function ThreadsBadge({subjectType, subjectId, subjectRange, onClick, mode}) {
  const threads = useCommentThreads({subjectType, subjectId, subjectRange, resolution: 'unresolved'});

  const handleClick = useCallback(() => {
    if (onClick) onClick(threads);
  }, [onClick, threads]);

  return <Badge counter={threads.length} mode={mode} onClick={handleClick} />;
}
