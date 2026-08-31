import {useMemo} from 'react';

import {useCommentThreadReads, useCurrentUser} from './ReviewStateProvider';
import {useDisplayedCommentThreadReads} from './commentThreadReadsSnapshot';

export function useUnreadActivityCount(threads) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();

  return useMemo(
    () => threads.reduce(
      (count, thread) => count + unreadActivity(thread, {
        currentUser,
        readAt: commentThreadReads[thread.permaId]
      }).length,
      0
    ),
    [threads, currentUser, commentThreadReads]
  );
}

export function useUnreadActivity(thread) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();

  return useMemo(
    () => unreadActivity(thread, {
      currentUser,
      readAt: commentThreadReads[thread.permaId]
    }),
    [thread, currentUser, commentThreadReads]
  );
}

export function useLiveUnreadActivity(thread) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useCommentThreadReads();

  return useMemo(
    () => unreadActivity(thread, {
      currentUser,
      readAt: commentThreadReads[thread.permaId]
    }),
    [thread, currentUser, commentThreadReads]
  );
}

export function threadActivity(thread) {
  const activity = thread.comments.map(comment => ({...comment, at: comment.createdAt}));

  if (thread.resolvedAt) {
    activity.push({
      resolution: true,
      at: thread.resolvedAt,
      createdAt: thread.resolvedAt,
      creatorId: thread.resolvedById
    });
  }

  return activity;
}

export function unreadActivity(thread, {currentUser, readAt}) {
  return threadActivity(thread).filter(event => isUnread(event, {currentUser, readAt}));
}

// Kept in sync with Pageflow::EntryCommentSummary, which applies the same
// rule server side.
export function isUnread({creatorId, createdAt}, {currentUser, readAt}) {
  if (!currentUser || creatorId === currentUser.id) return false;

  const seenUpTo = latestTime([readAt, currentUser.unreadCommentsSinceAt]);

  return seenUpTo === null || new Date(createdAt).getTime() > seenUpTo;
}

function latestTime(timestamps) {
  const times = timestamps.filter(Boolean).map(timestamp => new Date(timestamp).getTime());

  return times.length ? Math.max(...times) : null;
}
