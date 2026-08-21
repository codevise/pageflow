import {useMemo} from 'react';

import {useCommentThreadReads, useCurrentUser} from './ReviewStateProvider';
import {useDisplayedCommentThreadReads} from './commentThreadReadsSnapshot';

export function useUnreadCommentCount(threads) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();

  return useMemo(
    () => threads.reduce(
      (count, thread) => count + unreadComments(thread, {
        currentUser,
        readAt: commentThreadReads[thread.permaId]
      }).length,
      0
    ),
    [threads, currentUser, commentThreadReads]
  );
}

export function useUnreadComments(thread) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();

  return useMemo(
    () => unreadComments(thread, {
      currentUser,
      readAt: commentThreadReads[thread.permaId]
    }),
    [thread, currentUser, commentThreadReads]
  );
}

// Counterpart of useUnreadComments for deciding whether a thread still
// needs to be marked read. Reading frozen state here would keep the
// thread unread no matter how often it was marked, leaving the read
// signal firing forever.
export function useLiveUnreadComments(thread) {
  const currentUser = useCurrentUser();
  const commentThreadReads = useCommentThreadReads();

  return useMemo(
    () => unreadComments(thread, {
      currentUser,
      readAt: commentThreadReads[thread.permaId]
    }),
    [thread, currentUser, commentThreadReads]
  );
}

// Comments the reviewer has not seen yet. Own comments never count: the
// reviewer has read what they just wrote, and a thread would otherwise
// turn unread by replying to it.
//
// Comments from before the reviewer's baseline do not count either. It
// keeps the comments that were already there when read tracking started
// - or when the reviewer joined - from all turning up as unread at once.
//
// Read state is only known once the current user has been fetched. Until
// then nothing counts as unread, so lists do not briefly show every
// thread as new.
export function unreadComments(thread, {currentUser, readAt}) {
  if (!currentUser) return [];

  const seenUpTo = latestTime([readAt, currentUser.unreadCommentsSinceAt]);

  return thread.comments.filter(
    comment => comment.creatorId !== currentUser.id &&
               (seenUpTo === null || new Date(comment.createdAt).getTime() > seenUpTo)
  );
}

function latestTime(timestamps) {
  const times = timestamps.filter(Boolean).map(timestamp => new Date(timestamp).getTime());

  return times.length ? Math.max(...times) : null;
}
