import {useMemo} from 'react';

import {useCommentThreadReadAt, useCurrentUser} from './ReviewStateProvider';

export function useUnreadComments(thread) {
  const currentUser = useCurrentUser();
  const readAt = useCommentThreadReadAt(thread.permaId);

  return useMemo(
    () => unreadComments(thread, {currentUser, readAt}),
    [thread, currentUser, readAt]
  );
}

// Comments the reviewer has not seen yet. Own comments never count: the
// reviewer has read what they just wrote, and a thread would otherwise
// turn unread by replying to it.
//
// Read state is only known once the current user has been fetched. Until
// then nothing counts as unread, so lists do not briefly show every
// thread as new.
export function unreadComments(thread, {currentUser, readAt}) {
  if (!currentUser) return [];

  const readAtTime = readAt ? new Date(readAt).getTime() : null;

  return thread.comments.filter(
    comment => comment.creatorId !== currentUser.id &&
               (readAtTime === null || new Date(comment.createdAt).getTime() > readAtTime)
  );
}
