import {events} from 'pageflow/frontend';
import {useEffect} from 'react';
import {usePrevious} from './usePrevious';

export const useSectionChangeEvents = (entryStructure, currentSectionIndex) => {
  const getSectionChapterTitle = (sectionIndex, delimiter = '') => entryStructure.filter(
    chapter => chapter.sections.some(section => section.sectionIndex === sectionIndex)
  )[0]?.title + delimiter;
  const previousSectionIndex = usePrevious(currentSectionIndex);

  useEffect(() => {
    if (previousSectionIndex !== currentSectionIndex) {
      events.trigger('page:change', {configuration: {
        title: getSectionChapterTitle(currentSectionIndex, ', ') + 'Section ' + currentSectionIndex
      }, index: currentSectionIndex});
    }
  });
};
