import React from 'react';

import {Section} from './Section';
import {EventContextDataProvider} from './useEventContextData';

import {useBackdrop} from './useBackdrop';
import {useBackdropMotifAreaCustomProperties} from './backdropCustomProperties';

export function TransitionGroup({
  transitionGroup,
  currentSectionIndex, setCurrentSection,
  scrollTargetSectionIndex, setScrollTargetSectionIndex
}) {
  const currentSection = transitionGroup.sections.find(section =>
    section.sectionIndex === currentSectionIndex
  ) || transitionGroup.sections[0];

  const backdrop = useBackdrop(currentSection);

  return (
    <div style={useBackdropMotifAreaCustomProperties(backdrop)}>
      {renderSections(transitionGroup.sections,
                      currentSectionIndex,
                      setCurrentSection,
                      scrollTargetSectionIndex,
                      setScrollTargetSectionIndex)}
    </div>
  );
}

function renderSections(sections,
                        currentSectionIndex,
                        setCurrentSection,
                        scrollTargetSectionIndex,
                        setScrollTargetSectionIndex) {
  function onActivate(section) {
    setCurrentSection(section);
    setScrollTargetSectionIndex(null);
  }

  return sections.map((section) => {
    return (
      <EventContextDataProvider key={section.permaId} section={section}>
        <Section state={state(section, currentSectionIndex)}
                 isScrollTarget={section.sectionIndex === scrollTargetSectionIndex}
                 onActivate={() => onActivate(section)}
                 section={section} />
      </EventContextDataProvider>
    )
  });
}

function state(section, currentSectionIndex) {
  if (section.sectionIndex > currentSectionIndex) {
    return 'below';
  }
  else if (section.sectionIndex < currentSectionIndex) {
    return 'above';
  }
  else {
    return 'active'
  }
}
