import React, {useState} from 'react';

import Section from './Section';
import MutedContext from './MutedContext';
import ScrollToSectionContext from './ScrollToSectionContext';

export default function Chapter(props) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [scrollTargetSectionIndex, setScrollTargetSectionIndex] = useState(null);

  const [muted, setMuted] = useState(true);

  function scrollToSection(index) {
    if (index === 'next') {
      index = currentSectionIndex + 1;
    }

    setScrollTargetSectionIndex(index);
  }

  return (
    <div id={props.anchor}>
      <MutedContext.Provider value={{muted: muted, setMuted: setMuted}}>
        <ScrollToSectionContext.Provider value={scrollToSection}>
          {renderSections(props.sections,
            currentSectionIndex,
            setCurrentSectionIndex,
            scrollTargetSectionIndex,
            setScrollTargetSectionIndex)}
        </ScrollToSectionContext.Provider>
      </MutedContext.Provider>
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
               nextSection={nextSection} />
    )});
}