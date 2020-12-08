import React, {useState, useCallback} from 'react';

import Chapter from "./Chapter";
import ScrollToSectionContext from './ScrollToSectionContext';
import {useEntryStructure} from '../entryState';
import {withInlineEditingDecorator} from './inlineEditing';
import {usePostMessageListener} from './usePostMessageListener';
import {useSectionChangeEvents} from './useSectionChangeEvents';
import {sectionChangeMessagePoster} from './sectionChangeMessagePoster';

import { AtmoProvider } from './useAtmo';

import styles from './Entry.module.css';

export default withInlineEditingDecorator('EntryDecorator', function Entry(props) {
  const [currentSectionIndex, setCurrentSectionIndexState] = useState(0);

  const [scrollTargetSectionIndex, setScrollTargetSectionIndex] = useState(null);

  const entryStructure = useEntryStructure();
  useSectionChangeEvents(entryStructure, currentSectionIndex);

  let updateChapterSlug = (slug) => {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, '#'+slug);
    }
  }

  const setCurrentSectionIndex = useCallback(index => {
    sectionChangeMessagePoster(index);
    setCurrentSectionIndexState(index);
    let sectionCounter = 0;
    let chapter = entryStructure.find(chapter => {
      sectionCounter += chapter.sections.length;
      return index < sectionCounter;
    });
    if (chapter) {
      updateChapterSlug(chapter.chapterSlug);
    }
  }, [setCurrentSectionIndexState, entryStructure]);

  const receiveMessage = useCallback(data => {
    if (data.type === 'SCROLL_TO_SECTION') {
      setScrollTargetSectionIndex(data.payload.index)
    }
  }, []);

  usePostMessageListener(receiveMessage);

  function scrollToSection(index) {
    if (index === 'next') {
      index = currentSectionIndex + 1;
    }

    setScrollTargetSectionIndex(index);
  }

  return (
    <div className={styles.Entry} id='goToContent'>
      <AtmoProvider>
        <ScrollToSectionContext.Provider value={scrollToSection}>
          {renderChapters(entryStructure,
                          currentSectionIndex,
                          setCurrentSectionIndex,
                          scrollTargetSectionIndex,
                          setScrollTargetSectionIndex)}
        </ScrollToSectionContext.Provider>
      </AtmoProvider>
    </div>
  );
})

function renderChapters(entryStructure,
                        currentSectionIndex,
                        setCurrentSectionIndex,
                        scrollTargetSectionIndex,
                        setScrollTargetSectionIndex) {
  return entryStructure.map((chapter, index) => {
    return(
      <Chapter key={index}
               chapterSlug={chapter.chapterSlug}
               permaId={chapter.permaId}
               sections={chapter.sections}
               currentSectionIndex={currentSectionIndex}
               setCurrentSectionIndex={setCurrentSectionIndex}
               scrollTargetSectionIndex={scrollTargetSectionIndex}
               setScrollTargetSectionIndex={setScrollTargetSectionIndex}
      />
    );
  });
}
