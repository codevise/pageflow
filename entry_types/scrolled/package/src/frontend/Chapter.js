import React from 'react';

import Section from './Section';
import {EventContextDataProvider} from './useEventContextData';

export default function Chapter(props) {
  return (
    <div id={`chapter-${props.permaId}`}>
      {renderSections(props.sections,
                      props.currentSectionIndex,
                      props.setCurrentSectionIndex,
                      props.scrollTargetSectionIndex,
                      props.setScrollTargetSectionIndex)}
    </div>
  );
}

function renderSections(sections,
                        currentSectionIndex,
                        setCurrentSectionIndex,
                        scrollTargetSectionIndex,
                        setScrollTargetSectionIndex) {
  function onActivate(sectionIndex) {
    setCurrentSectionIndex(sectionIndex);
    setScrollTargetSectionIndex(null);
  }

  return sections.map((section) => {
    return (
      <EventContextDataProvider key={section.permaId} sectionIndex={section.sectionIndex}>
        <Section state={section.sectionIndex > currentSectionIndex ? 'below' : section.sectionIndex < currentSectionIndex ? 'above' : 'active'}
                 isScrollTarget={section.sectionIndex === scrollTargetSectionIndex}
                 onActivate={() => onActivate(section.sectionIndex)}
                 {...section} />
      </EventContextDataProvider>
    )
  });
}
