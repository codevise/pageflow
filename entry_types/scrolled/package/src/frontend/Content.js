import React, {useState, useCallback} from 'react';

import Chapter from "./Chapter";
import ScrollToSectionContext from './ScrollToSectionContext';
import {useCurrentSectionIndexState} from './useCurrentChapter';
import {useEntryStructure} from '../entryState';
import {withInlineEditingDecorator} from './inlineEditing';
import {usePostMessageListener} from './usePostMessageListener';
import {useSectionChangeEvents} from './useSectionChangeEvents';
import {sectionChangeMessagePoster} from './sectionChangeMessagePoster';

import { AtmoProvider } from './useAtmo';

import styles from './Content.module.css';

export const Content = withInlineEditingDecorator('ContentDecorator', function Content(props) {
  const [currentSectionIndex, setCurrentSectionIndexState] = useCurrentSectionIndexState();

  const [scrollTargetSectionIndex, setScrollTargetSectionIndex] = useState(null);

  const entryStructure = useEntryStructure();
  useSectionChangeEvents(currentSectionIndex);

  let updateChapterSlug = (slug) => {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, '#'+slug);
    }
  }

  const setCurrentSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentSectionIndexState(section.sectionIndex);
    updateChapterSlug(section.chapter.chapterSlug);
  }, [setCurrentSectionIndexState]);

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
    <div className={styles.Content} id='goToContent'>
      <AtmoProvider>
        <ScrollToSectionContext.Provider value={scrollToSection}>
          {renderChapters(entryStructure,
                          currentSectionIndex,
                          setCurrentSection,
                          scrollTargetSectionIndex,
                          setScrollTargetSectionIndex)}
        </ScrollToSectionContext.Provider>
      </AtmoProvider>
    </div>
  );
})

function renderChapters(entryStructure,
                        currentSectionIndex,
                        setCurrentSection,
                        scrollTargetSectionIndex,
                        setScrollTargetSectionIndex) {
  return entryStructure.map((chapter, index) => {
    return(
      <Chapter key={index}
               chapterSlug={chapter.chapterSlug}
               permaId={chapter.permaId}
               sections={chapter.sections}
               currentSectionIndex={currentSectionIndex}
               setCurrentSection={setCurrentSection}
               scrollTargetSectionIndex={scrollTargetSectionIndex}
               setScrollTargetSectionIndex={setScrollTargetSectionIndex}
      />
    );
  });
}
