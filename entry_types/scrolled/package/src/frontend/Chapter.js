import React from 'react';

import {Section} from './Section';
import {EventContextDataProvider} from './useEventContextData';

export default function Chapter(props) {
  return (
    <div id={props.chapterSlug}>
      {renderSections(props.sections,
                      props.currentSectionIndex,
                      props.setCurrentSection,
                      props.scrollTargetSectionIndex,
                      props.setScrollTargetSectionIndex)}
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
        <Section state={section.sectionIndex > currentSectionIndex ? 'below' : section.sectionIndex < currentSectionIndex ? 'above' : 'active'}
                 isScrollTarget={section.sectionIndex === scrollTargetSectionIndex}
                 onActivate={() => onActivate(section)}
                 section={section} />
      </EventContextDataProvider>
    )
  });
}
