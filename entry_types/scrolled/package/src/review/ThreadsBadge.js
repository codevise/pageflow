import React, {useCallback} from 'react';

import {useI18n} from 'pageflow-scrolled/frontend';
import {useLocatedCommentThreadsForSubject} from './useLocatedCommentThreadsForSubject';
import {useUnreadCommentCount} from './unreadComments';
import {Badge} from './Badge';

export function ThreadsBadge({subjectType, subjectId, subjectRange, onClick, mode, resolution = 'unresolved', revealedThreadId}) {
  const {t} = useI18n({locale: 'ui'});

  const threads = useLocatedCommentThreadsForSubject({
    subjectType, subjectId, subjectRange, resolution, revealedThreadId
  });
  const unresolvedThreads =
    useLocatedCommentThreadsForSubject({subjectType, subjectId, subjectRange, resolution: 'unresolved'});

  const unreadCommentCount = useUnreadCommentCount(threads);

  const handleClick = useCallback(() => {
    if (onClick) onClick(threads);
  }, [onClick, threads]);

  const resolved = threads.length > 0 && unresolvedThreads.length === 0;

  return <Badge counter={threads.length}
                mode={mode}
                resolved={resolved}
                unread={unreadCommentCount > 0}
                label={unreadCommentCount > 0 ?
                       t('pageflow_scrolled.review.unread_comment_count',
                         {count: unreadCommentCount}) :
                       undefined}
                onClick={handleClick} />;
}
