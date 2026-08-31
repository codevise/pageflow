import {useEffect} from 'react';

import {useMarkThreadRead} from './ReviewStateProvider';
import {useLiveUnreadActivity} from './unreadActivity';

const DWELL_TIME = 800;

// A thread taller than the viewport could never reach a visibility ratio.
const ROOT_MARGIN = '-10% 0px -10% 0px';

export function useMarkThreadReadWhenSeen({thread, ref, enabled}) {
  const unread = useLiveUnreadActivity(thread);
  const markThreadRead = useMarkThreadRead();

  const {permaId} = thread;
  const hasUnread = unread.length > 0;

  useEffect(() => {
    const element = ref.current;

    if (!enabled || !hasUnread || !markThreadRead || !element) return;

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
  }, [enabled, hasUnread, markThreadRead, permaId, ref]);
}
