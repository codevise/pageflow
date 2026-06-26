import {useMemo} from 'react';

import {matchesResolution} from './ReviewStateProvider';
import {useLocatedCommentThreads} from './useLocatedCommentThreads';

const NONE = [];

// Reads a subject's threads from the shared LocatedCommentThreadsProvider
// — for a section that includes the orphaned threads folded into it — and
// filters by resolution and range. Lets ThreadList/ThreadsBadge consume
// threads by subject without re-scanning review state or re-running the
// join, and keeps resolution/range filtering out of the components.
/**
 * @private
 */
export function useLocatedCommentThreadsForSubject({
  subjectType, subjectId, subjectRange, resolution = 'all'
}) {
  const {bySubject} = useLocatedCommentThreads();

  return useMemo(() => {
    const threads = bySubject.get(`${subjectType}:${subjectId}`) || NONE;
    const rangeKey = subjectRange ? JSON.stringify(subjectRange) : undefined;

    return threads.filter(thread =>
      matchesResolution(thread, resolution) &&
      (!rangeKey || JSON.stringify(thread.subjectRange) === rangeKey)
    );
  }, [bySubject, subjectType, subjectId, subjectRange, resolution]);
}
