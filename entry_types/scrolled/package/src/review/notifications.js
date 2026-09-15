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

// Kept in sync with Pageflow::CommentNotificationLevel.notifies?, which
// applies the same rule server side. Both are held to the cases in
// spec/fixtures/comment_notification_rules.json.
export function notifies(level, participated) {
  switch (level) {
  case 'all_activity':
    return true;
  case 'participating_threads':
    return participated;
  default:
    return false;
  }
}

function participatedIn(thread, currentUser) {
  return thread.comments.some(comment => comment.creatorId === currentUser.id);
}
