import {useCallback, useRef} from 'react';
import {getEventObject} from './useEventContextData';

export function useSectionChangeEvents(events) {
  const previousSectionPermaIdRef = useRef();

  return useCallback((section, sectionsCount) => {
    if (previousSectionPermaIdRef.current !== section?.permaId) {
      events.trigger('page:change', getEventObject({section, sectionsCount}));
      previousSectionPermaIdRef.current = section?.permaId;
    }
  }, [events]);
}
