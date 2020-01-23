import React, {useEffect, useState} from 'react';

import Chapter from "./Chapter";
import MutedContext from './MutedContext';
import ScrollToSectionContext from './ScrollToSectionContext';
import {useEntryStructure, useEntryStateDispatch} from '../entryState';

import styles from './Entry.module.css';

export default function Entry(props) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [scrollTargetSectionIndex, setScrollTargetSectionIndex] = useState(null);

  const [muted, setMuted] = useState(true);

  const dispatch = useEntryStateDispatch();
  const entryStructure = useEntryStructure();

  useEffect(() => {
    if (window.parent) {
      window.addEventListener('message', receive)
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }

    return () => window.removeEventListener('message', receive);

    function receive(message) {
      if (window.location.href.indexOf(message.origin) === 0 &&
          message.data.type === 'ACTION') {
        dispatch(message.data.payload);
      }
    }
  }, [dispatch]);

  function scrollToSection(index) {
    if (index === 'next') {
      index = currentSectionIndex + 1;
    }

    setScrollTargetSectionIndex(index);
  }

  return (
    <div className={styles.Entry}>
      <MutedContext.Provider value={{muted: muted, setMuted: setMuted}}>
        <ScrollToSectionContext.Provider value={scrollToSection}>
          {renderChapters(entryStructure,
                          currentSectionIndex,
                          setCurrentSectionIndex,
                          scrollTargetSectionIndex,
                          setScrollTargetSectionIndex)}
        </ScrollToSectionContext.Provider>
      </MutedContext.Provider>
    </div>
  );
}

function renderChapters(entryStructure,
                        currentSectionIndex,
                        setCurrentSectionIndex,
                        scrollTargetSectionIndex,
                        setScrollTargetSectionIndex) {
  return entryStructure.map((chapter, index) => {
    return(
      <Chapter key={index}
               permaId={chapter.permaId}
               sections={chapter.sections}
               currentSectionIndex={currentSectionIndex}
               setCurrentSectionIndex={setCurrentSectionIndex}
               scrollTargetSectionIndex={scrollTargetSectionIndex}
               setScrollTargetSectionIndex={setScrollTargetSectionIndex}
      />
    );
  });
}
