import React from 'react';

import {TransitionGroup} from './TransitionGroup';

export default function Chapter(props) {
  return (
    <div id={props.chapterSlug}>
      {renderTransitionGroups(props.transitionGroups,
                              props.currentSectionIndex,
                              props.setCurrentSection,
                              props.scrollTargetSectionIndex,
                              props.setScrollTargetSectionIndex)}
    </div>
  );
}

function renderTransitionGroups(transitionGroups,
                                currentSectionIndex,
                                setCurrentSection,
                                scrollTargetSectionIndex,
                                setScrollTargetSectionIndex) {
  return transitionGroups.map((transitionGroup) => {
    return (
      <TransitionGroup key={transitionGroup.sections[0].permaId}
                       transitionGroup={transitionGroup}
                       currentSectionIndex={currentSectionIndex}
                       setCurrentSection={setCurrentSection}
                       scrollTargetSectionIndex={scrollTargetSectionIndex}
                       setScrollTargetSectionIndex={setScrollTargetSectionIndex} />
    )
  });
}
