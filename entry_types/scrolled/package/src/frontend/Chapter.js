import React from 'react';

import {Section} from './Section';
import {EventContextDataProvider} from './useEventContextData';

export default function Chapter(props) {
  return (
    <div id={props.chapterSlug}>
      {renderSections(props.sections,
                      props.currentSectionIndex,
                      props.setCurrentSection)}
    </div>
  );
}

function renderSections(sections,
                        currentSectionIndex,
                        setCurrentSection) {
  function onActivate(section) {
    setCurrentSection(section);
  }

  return sections.map((section) => {
    return (
      <EventContextDataProvider key={section.permaId} section={section} sectionsCount={sections.length}>
        <Section state={section.sectionIndex > currentSectionIndex ? 'below' : section.sectionIndex < currentSectionIndex ? 'above' : 'active'}
                 onActivate={() => onActivate(section)}
                 section={section} />
      </EventContextDataProvider>
    )
  });
}
