import {useEffect} from 'react';

import {useMarkThreadRead} from './ReviewStateProvider';
import {useLiveUnreadComments} from './unreadComments';

const DWELL_TIME = 800;

// Threads that only peek in at the very edge of the viewport have not
// been read, but anything substantially on screen has. Expressed as a
// margin rather than a visibility ratio, which a thread taller than the
// viewport could never reach.
const ROOT_MARGIN = '-10% 0px -10% 0px';

// A thread counts as read once it has been on screen long enough to
// actually read it. Scrolling past it therefore leaves it unread.
//
// Callers pass `enabled: false` while the thread keeps an unread comment
// out of sight, and in lists that survey many threads at once, where
// being on screen is not the reviewer choosing to read one.
export function useMarkThreadReadWhenSeen({thread, ref, enabled}) {
  const unreadComments = useLiveUnreadComments(thread);
  const markThreadRead = useMarkThreadRead();

  const {permaId} = thread;
  const hasUnreadComments = unreadComments.length > 0;

  useEffect(() => {
    const element = ref.current;

    if (!enabled || !hasUnreadComments || !markThreadRead || !element) return;

    let timeout;

    const observer = new IntersectionObserver(entries => {
      clearTimeout(timeout);

      if (entries[entries.length - 1].isIntersecting) {
        timeout = setTimeout(() => markThreadRead(permaId), DWELL_TIME);
      }
    }, {rootMargin: ROOT_MARGIN});

    observer.observe(element);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [enabled, hasUnreadComments, markThreadRead, permaId, ref]);
}
