import {useMemo, useRef} from 'react';

import {useCommentThreadReads, useCurrentUser} from './ReviewStateProvider';
import {useDisplayedCommentThreadReads} from './commentThreadReadsSnapshot';
import {useLocatedCommentThreads} from './useLocatedCommentThreads';
import {isUnread, threadActivity} from './unreadActivity';

export function useActivityEntries() {
  const {threads} = useLocatedCommentThreads();
  const currentUser = useCurrentUser();
  const commentThreadReads = useDisplayedCommentThreadReads();

  const entries = useMemo(
    () => activityEntries({threads, currentUser, commentThreadReads}),
    [threads, currentUser, commentThreadReads]
  );

  return useHeldOrder(entries);
}

function useHeldOrder(entries) {
  const takenAt = useRef(new Map());

  return useMemo(() => {
    entries.forEach(entry => {
      if (!takenAt.current.has(entry.threadId)) {
        takenAt.current.set(entry.threadId, entry.at);
      }
    });

    return entries
      .map(entry => ({...entry, at: takenAt.current.get(entry.threadId)}))
      .sort(compareEntries);
  }, [entries]);
}

export function useUnreadThreadCount() {
  const {threads} = useLocatedCommentThreads();
  const currentUser = useCurrentUser();
  const commentThreadReads = useCommentThreadReads();

  return useMemo(
    () => activityEntries({threads, currentUser, commentThreadReads})
      .filter(entry => entry.unreadCount > 0).length,
    [threads, currentUser, commentThreadReads]
  );
}

export function activityEntries({threads, currentUser, commentThreadReads}) {
  return threads
    .map(thread => threadEntry(thread, {
      currentUser,
      readAt: commentThreadReads[thread.permaId]
    }))
    .filter(Boolean)
    .sort(compareEntries);
}

function threadEntry(thread, {currentUser, readAt}) {
  const events = threadActivity(thread);

  if (!events.length) return null;

  const latest = events.reduce(
    (result, event) => (new Date(event.at) >= new Date(result.at) ? event : result)
  );
  const unreadEvents = events.filter(event => isUnread(event, {currentUser, readAt}));

  return {
    key: `thread-${thread.id}`,
    thread,
    threadId: thread.id,
    threadPermaId: thread.permaId,
    at: latest.at,
    unreadCount: unreadEvents.length,
    unreadCommentIds: unreadEvents.filter(event => event.id).map(event => event.id),
    resolved: !!thread.resolvedAt
  };
}

function compareEntries(a, b) {
  return new Date(b.at) - new Date(a.at) || a.threadId - b.threadId;
}
