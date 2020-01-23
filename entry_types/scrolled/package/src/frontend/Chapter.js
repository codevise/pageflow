import React from 'react';

import Section from './Section';

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
      <Section key={section.permaId}
               state={section.sectionIndex > currentSectionIndex ? 'below' : section.sectionIndex < currentSectionIndex ? 'above' : 'active'}
               isScrollTarget={section.sectionIndex === scrollTargetSectionIndex}
               onActivate={() => onActivate(section.sectionIndex)}
               {...section} />
    )
  });
}