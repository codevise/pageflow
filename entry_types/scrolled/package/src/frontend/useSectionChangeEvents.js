import {events} from 'pageflow/frontend';
import {useEffect} from 'react';
import {usePrevious} from './usePrevious';
import {getEventObject} from './useEventContextData';
import {useSectionsWithChapter} from '../entryState';

export function useSectionChangeEvents(currentSectionIndex) {
  const previousSectionIndex = usePrevious(currentSectionIndex);
  const sections = useSectionsWithChapter();

  useEffect(() => {
    if (previousSectionIndex !== currentSectionIndex) {
      events.trigger('page:change', getEventObject({
        section: sections[currentSectionIndex],
        sectionsCount: sections.length
      }));
    }
  });
};
