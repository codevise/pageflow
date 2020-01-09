import React from 'react';

import Section from './Section';

export default function Chapter(props) {
  return (
    <div id={'chapter' + props.permaId}>
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
  function onActivate(index) {
    setCurrentSectionIndex(index);
    setScrollTargetSectionIndex(null);
  }

  return sections.map((section, index) => {
    const previousSection = sections[index - 1];
    const nextSection = sections[index + 1];

    return (
      <Section key={index}
               state={index > currentSectionIndex ? 'below' : index < currentSectionIndex ? 'above' : 'active'}
               isScrollTarget={index === scrollTargetSectionIndex}
               onActivate={() => onActivate(index)}
               {...section}
               previousSection={previousSection}
               nextSection={nextSection}/>
    )
  });
}