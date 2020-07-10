import React, {useState, useCallback} from 'react';

import Chapter from "./Chapter";
import {MediaMutedProvider} from './useMediaMuted';
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

  const setCurrentSectionIndex = useCallback(index => {
    sectionChangeMessagePoster(index);
    setCurrentSectionIndexState(index);
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
    <div className={styles.Entry}>
      <MediaMutedProvider>
        <AtmoProvider>
          <ScrollToSectionContext.Provider value={scrollToSection}>
            {renderChapters(entryStructure,
                            currentSectionIndex,
                            setCurrentSectionIndex,
                            scrollTargetSectionIndex,
                            setScrollTargetSectionIndex)}
          </ScrollToSectionContext.Provider>
        </AtmoProvider>
      </MediaMutedProvider>
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
