import React, {useState, useContext, useMemo} from 'react';

import {useSectionsWithChapter} from '../entryState';

const CurrentChapterContext = React.createContext();
const CurrentSectionIndexStateContext = React.createContext();

export function CurrentSectionProvider({children}) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const currentSectionIndexState = useMemo(
    () => [currentSectionIndex, setCurrentSectionIndex],
    [currentSectionIndex, setCurrentSectionIndex]
  );

  const sections = useSectionsWithChapter();
  const currentSection = sections[currentSectionIndex];

  return (
    <CurrentChapterContext.Provider value={currentSection?.chapter}>
      <CurrentSectionIndexStateContext.Provider value={currentSectionIndexState}>
        {children}
      </CurrentSectionIndexStateContext.Provider>
    </CurrentChapterContext.Provider>
  );
}

/**
 * Returns chapter containing the current scroll position.
 *
 * @example
 *
 * const chapter = useCurrentChapter();
 * chapter // =>
 *  {
 *    id: 3,
 *    permaId: 5,
 *    title: 'Chapter 1',
 *    summary: 'An introductory chapter',
 *    chapterSlug: 'chapter-1'
 *  }
 */
export function useCurrentChapter() {
  return useContext(CurrentChapterContext);
}

export function useCurrentSectionIndexState() {
  return useContext(CurrentSectionIndexStateContext);
}
