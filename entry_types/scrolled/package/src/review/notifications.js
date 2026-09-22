import {useMemo} from 'react';

import {useCurrentUser} from './ReviewStateProvider';

export function useThreadsNotify(threads) {
  const currentUser = useCurrentUser();

  return useMemo(
    () => !!currentUser && threads.some(
      thread => notifies(thread.notificationLevel, participatedIn(thread, currentUser))
    ),
    [threads, currentUser]
  );
}

// Whether activity in this thread would notify, regardless of whether
// any has arrived yet: the thread either notifies or it does not.
export function useThreadNotifies(thread) {
  const currentUser = useCurrentUser();

  return useMemo(
    () => !!currentUser && notifies(thread.notificationLevel,
                                    participatedIn(thread, currentUser)),
    [thread, currentUser]
  );
}

// Kept in sync with Pageflow::CommentNotificationLevel.notifies?, which
// applies the same rule server side. Both are held to the cases in
// spec/fixtures/comment_notification_rules.json.
export function notifies(level, participated) {
  switch (level) {
  case 'all_activity':
    return true;
  case 'participating_threads':
    return participated;
  case 'watched_threads':
    return false;
  default:
    return false;
  }
}

function participatedIn(thread, currentUser) {
  return thread.comments.some(comment => comment.creatorId === currentUser.id);
}
