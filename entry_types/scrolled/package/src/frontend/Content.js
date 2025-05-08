import React, {useCallback} from 'react';

import Chapter from "./Chapter";
import {VhFix} from './VhFix';
import {useCurrentSectionIndexState} from './useCurrentChapter';
import {useEntryStructure} from '../entryState';
import {withInlineEditingDecorator} from './inlineEditing';
import {usePostMessageListener} from './usePostMessageListener';
import {useSectionChangeEvents} from './useSectionChangeEvents';
import {sectionChangeMessagePoster} from './sectionChangeMessagePoster';
import {useScrollToTarget} from './useScrollTarget';

import {AtmoProvider} from './useAtmo';
import {Widget} from './Widget';

import styles from './Content.module.css';

export const Content = withInlineEditingDecorator('ContentDecorator', function Content(props) {
  const [currentSectionIndex, setCurrentSectionIndexState] = useCurrentSectionIndexState();

  const entryStructure = useEntryStructure();
  useSectionChangeEvents(currentSectionIndex);

  let updateChapterSlug = (section) => {
    if (window.history && window.history.replaceState) {
      if (section.sectionIndex > 0) {
        window.history.replaceState(null, null, '#'+ section.chapter.chapterSlug);
      }
      else {
        window.history.replaceState(null, null, window.location.href.split('#')[0]);
      }
    }
  }

  const setCurrentSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentSectionIndexState(section.sectionIndex);
    updateChapterSlug(section);
  }, [setCurrentSectionIndexState]);

  const scrollToTarget = useScrollToTarget();

  const receiveMessage = useCallback(data => {
    if (data.type === 'SCROLL_TO_SECTION') {
      scrollToTarget({id: data.payload.id, align: data.payload.align});
    }
  }, [scrollToTarget]);

  usePostMessageListener(receiveMessage);

  return (
    <div className={styles.Content} id='goToContent'>
      <VhFix>
        <AtmoProvider>
          {renderChapters(entryStructure.main,
                          currentSectionIndex,
                          setCurrentSection)}
          {renderExcursions(entryStructure.excursions,
                            currentSectionIndex,
                            setCurrentSection)}
        </AtmoProvider>
      </VhFix>
    </div>
  );
})

function renderExcursions(excursions,
                          currentSectionIndex,
                          setCurrentSection) {
  return excursions.map(excursion =>
    <Widget key={excursion.id}
            role="excursion">
      {renderChapters([excursion],
                      currentSectionIndex,
                      setCurrentSection)}
    </Widget>
  );
}

function renderChapters(chapters,
                        currentSectionIndex,
                        setCurrentSection) {
  return chapters.map((chapter, index) => {
    return(
      <Chapter key={index}
               chapterSlug={chapter.chapterSlug}
               permaId={chapter.permaId}
               sections={chapter.sections}
               currentSectionIndex={currentSectionIndex}
               setCurrentSection={setCurrentSection} />
    );
  });
}
