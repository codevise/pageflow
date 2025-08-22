import React, {useCallback, useState} from 'react';

import Chapter from "./Chapter";
import {VhFix} from './VhFix';
import {useActiveExcursion} from './useActiveExcursion';
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
  const entryStructure = useEntryStructure();

  const {
    activeExcursion,
    activateExcursionOfSection,
    returnFromExcursion
  } = useActiveExcursion(entryStructure);

  const [currentSectionIndex, setCurrentSectionIndexState] = useCurrentSectionIndexState();

  const [currentExcursionSectionIndex, setCurrentExcursionSectionIndex] = useState(0);

  useSectionChangeEvents(currentSectionIndex);

  let updateChapterSlug = (section) => {
    if (section.sectionIndex > 0) {
      window.history.replaceState(null, null, '#'+ section.chapter.chapterSlug);
    }
    else {
      window.history.replaceState(null, null, window.location.href.split('#')[0]);
    }
  }

  let updateExcursionChapterSlug = (section) => {
    window.history.replaceState(null, null, '#'+ section.chapter.chapterSlug);
  }

  const setCurrentSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentSectionIndexState(section.sectionIndex);
    updateChapterSlug(section);
  }, [setCurrentSectionIndexState]);

  const setCurrentExcursionSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentExcursionSectionIndex(section.sectionIndex);
    updateExcursionChapterSlug(section);
  }, [setCurrentExcursionSectionIndex]);

  const scrollToTarget = useScrollToTarget();

  const receiveMessage = useCallback(data => {
    if (data.type === 'SCROLL_TO_SECTION') {
      activateExcursionOfSection({id: data.payload.id});
      scrollToTarget({id: data.payload.id, align: data.payload.align});
    }
  }, [scrollToTarget, activateExcursionOfSection]);

  usePostMessageListener(receiveMessage);

  return (
    <div className={styles.Content} id='goToContent'>
      <VhFix>
        <AtmoProvider>
          {renderMainStoryline(entryStructure.main,
                               activeExcursion,
                               currentSectionIndex,
                               setCurrentSection)}
          {renderExcursion(activeExcursion,
                           currentExcursionSectionIndex,
                           setCurrentExcursionSection,
                           {onClose: () => returnFromExcursion()})}
        </AtmoProvider>
      </VhFix>
    </div>
  );
})

function renderMainStoryline(chapters, activeExcursion, currentSectionIndex, setCurrentSection) {
  return (
    <Widget role="mainStoryline"
            props={{activeExcursion}}
            renderFallback={({children}) => children}>
      {renderChapters(chapters, currentSectionIndex, setCurrentSection)}
      <Widget role="footer" />
    </Widget>
  );
}

function renderExcursion(
  excursion, currentExcursionSectionIndex, setCurrentExcursionSection, {onClose}
) {
  if (excursion) {
    return (
      <Widget role="excursion"
              props={{excursion, onClose}}>
        {renderChapters([excursion],
                        currentExcursionSectionIndex,
                        setCurrentExcursionSection)}
      </Widget>
    );
  }
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
