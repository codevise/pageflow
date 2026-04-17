import React from 'react';

import {useCommentThreads} from './ReviewStateProvider';
import {Badge} from './Badge';

export function ThreadsBadge({subjectType, subjectId, subjectRange, onClick, mode}) {
  const threads = useCommentThreads({subjectType, subjectId, subjectRange}, {resolved: false});

  return <Badge counter={threads.length} mode={mode} onClick={onClick} />;
}
