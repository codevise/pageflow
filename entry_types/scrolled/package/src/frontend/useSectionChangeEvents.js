import {events} from 'pageflow/frontend';
import {useEffect} from 'react';
import {usePrevious} from './usePrevious';
import {getEventObject} from './useEventContextData';


export const useSectionChangeEvents = (entryStructure, currentSectionIndex) => {
  const previousSectionIndex = usePrevious(currentSectionIndex);

  useEffect(() => {
    if (previousSectionIndex !== currentSectionIndex) {
      events.trigger('page:change', getEventObject(currentSectionIndex, entryStructure));
    }
  });
};
