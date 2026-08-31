import {useMemo} from 'react';

import {matchesResolution} from './ReviewStateProvider';
import {useLocatedCommentThreads} from './useLocatedCommentThreads';

const NONE = [];

/**
 * @private
 */
export function useLocatedCommentThreadsForSubject({
  subjectType, subjectId, subjectRange, resolution = 'all', revealedThreadId
}) {
  const {bySubject} = useLocatedCommentThreads();

  return useMemo(() => {
    const threads = bySubject.get(`${subjectType}:${subjectId}`) || NONE;
    const rangeKey = subjectRange ? JSON.stringify(subjectRange) : undefined;

    return threads.filter(thread =>
      (matchesResolution(thread, resolution) || thread.id === revealedThreadId) &&
      (!rangeKey || JSON.stringify(thread.subjectRange) === rangeKey)
    );
  }, [bySubject, subjectType, subjectId, subjectRange, resolution, revealedThreadId]);
}
