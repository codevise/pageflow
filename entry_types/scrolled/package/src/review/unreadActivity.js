import {useMemo} from 'react';

import {useCommentThreadReads, useCurrentUser} from './ReviewStateProvider';
import {useDisplayedCommentThreadReads} from './commentThreadReadsSnapshot';
import {useThreadsNotify} from './notifications';

// Only the threads that have unread activity can make the set notify,
// so the intersection is taken here rather than by each caller.
export function useUnreadActivitySummary(threads) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();

  const {unreadCount, unreadThreads} = useMemo(
    () => {
      const unreadThreads = [];
      let unreadCount = 0;

      threads.forEach(thread => {
        const events = unreadActivity(thread, {
          currentUser,
          readAt: commentThreadReads[thread.permaId]
        });

        if (events.length) {
          unreadCount += events.length;
          unreadThreads.push(thread);
        }
      });

      return {unreadCount, unreadThreads};
    },
    [threads, currentUser, commentThreadReads]
  );

  const notifying = useThreadsNotify(unreadThreads);

  return useMemo(() => ({unreadCount, notifying}), [unreadCount, notifying]);
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

export function useHasLiveUnreadActivity(thread) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useCommentThreadReads();

  return useMemo(
    () => unreadActivity(thread, {
      currentUser,
      readAt: commentThreadReads[thread.permaId]
    }).length > 0,
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

// Kept in sync with Pageflow::CommentThreadActivity, which applies the same
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
