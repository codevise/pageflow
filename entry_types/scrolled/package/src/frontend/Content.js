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
import {useChapterSlugUpdater} from './useChapterSlugUpdater';

import {AtmoProvider} from './useAtmo';
import {Widget} from './Widget';
import {StorylineActivity} from './useScrollPositionLifecycle';

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

  const {updateChapterSlug, updateExcursionChapterSlug} = useChapterSlugUpdater();

  useSectionChangeEvents(currentSectionIndex);

  const setCurrentSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentSectionIndexState(section.sectionIndex);
    updateChapterSlug(section);
  }, [setCurrentSectionIndexState, updateChapterSlug]);

  const setCurrentExcursionSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex, section.chapter.id);
    setCurrentExcursionSectionIndex(section.sectionIndex);
    updateExcursionChapterSlug(section);
  }, [updateExcursionChapterSlug]);

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
                           {onClose: () => {
                             returnFromExcursion();
                             sectionChangeMessagePoster(currentSectionIndex);
                           }})}
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
      <StorylineActivity mode={activeExcursion ? 'background' : 'active'}>
        {renderChapters(chapters, currentSectionIndex, setCurrentSection)}
      </StorylineActivity>
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
