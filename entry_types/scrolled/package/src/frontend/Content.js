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
import {events} from 'pageflow/frontend';

import {AtmoProvider} from './useAtmo';
import {Widget} from './Widget';

import {
  MainStorylineActivity, MainStorylineCoverageProvider, useMainStorylineCoverage
} from './storylineActivity';

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

  const triggerSectionChange = useSectionChangeEvents(events);

  const setCurrentSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentSectionIndexState(section.sectionIndex);
    updateChapterSlug(section);
    triggerSectionChange(section, entryStructure.mainSectionsCount);
  }, [setCurrentSectionIndexState, updateChapterSlug, triggerSectionChange, entryStructure.mainSectionsCount]);

  const setCurrentExcursionSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex, section.chapter.id);
    setCurrentExcursionSectionIndex(section.sectionIndex);
    updateExcursionChapterSlug(section);
    triggerSectionChange(section, activeExcursion.sections.length);
  }, [updateExcursionChapterSlug, triggerSectionChange, activeExcursion]);

  const scrollToTarget = useScrollToTarget();

  const receiveMessage = useCallback(data => {
    if (data.type === 'SCROLL_TO_SECTION') {
      activateExcursionOfSection({id: data.payload.id});
      scrollToTarget({id: data.payload.id, align: data.payload.align, ifNeeded: data.payload.ifNeeded});
    }
  }, [scrollToTarget, activateExcursionOfSection]);

  usePostMessageListener(receiveMessage);

  return (
    <div className={styles.Content} id='goToContent'>
      <VhFix>
        <MainStorylineCoverageProvider>
          <AtmoProvider>
            {renderMainStoryline(entryStructure.main,
                                 activeExcursion,
                                 currentSectionIndex,
                                 setCurrentSection)}
            <ActiveExcursion
              excursion={activeExcursion}
              currentExcursionSectionIndex={currentExcursionSectionIndex}
              setCurrentExcursionSection={setCurrentExcursionSection}
              onClose={() => {
                returnFromExcursion();
                sectionChangeMessagePoster(currentSectionIndex);
              }}
            />
          </AtmoProvider>
        </MainStorylineCoverageProvider>
      </VhFix>
    </div>
  );
})

function renderMainStoryline(chapters, activeExcursion, currentSectionIndex, setCurrentSection) {
  return (
    <Widget role="mainStoryline"
              props={{activeExcursion}}
              renderFallback={({children}) => children}>
      <MainStorylineActivity activeExcursion={activeExcursion}>
        {renderChapters(chapters, currentSectionIndex, setCurrentSection)}
      </MainStorylineActivity>
      <Widget role="footer" />
    </Widget>
  );
}

function ActiveExcursion({
  excursion,
  currentExcursionSectionIndex,
  setCurrentExcursionSection,
  onClose
}) {
  const {setMainStorylineCovered} = useMainStorylineCoverage();

  if (!excursion) {
    return null;
  }

  return (
    <Widget role="excursion"
            props={{
              excursion,
              onClose: () => {
                onClose();
                setMainStorylineCovered(false);
              },
              setIsCoveringBackground: setMainStorylineCovered
            }}>
      {renderChapters([excursion],
                      currentExcursionSectionIndex,
                      setCurrentExcursionSection)}
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
