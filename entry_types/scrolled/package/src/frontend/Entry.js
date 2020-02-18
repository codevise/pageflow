import React, {useEffect, useState, useCallback} from 'react';

import Chapter from "./Chapter";
import MutedContext from './MutedContext';
import ScrollToSectionContext from './ScrollToSectionContext';
import {useEntryStructure, useEntryStateDispatch} from '../entryState';
import {useEditorSelection} from './EditorState';

import styles from './Entry.module.css';

export default function Entry(props) {
  const [currentSectionIndex, setCurrentSectionIndexState] = useState(0);

  const [scrollTargetSectionIndex, setScrollTargetSectionIndex] = useState(null);
  const {select} = useEditorSelection()

  const [muted, setMuted] = useState(true);

  const dispatch = useEntryStateDispatch();
  const entryStructure = useEntryStructure();

  const setCurrentSectionIndex = useCallback(index => {
    if (window.parent) {
      window.parent.postMessage({type: 'CHANGE_SECTION', payload: {index}}, window.location.origin);
    }

    setCurrentSectionIndexState(index);
  }, [setCurrentSectionIndexState]);

  useEffect(() => {
    if (window.parent !== window) {
      window.addEventListener('message', receive)
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }

    return () => window.removeEventListener('message', receive);

    function receive(message) {
      if (window.location.href.indexOf(message.origin) === 0) {
        if (message.data.type === 'ACTION') {
          dispatch(message.data.payload);
        }
        else if (message.data.type === 'SCROLL_TO_SECTION') {
          setScrollTargetSectionIndex(message.data.payload.index)
        }
        else if (message.data.type === 'SELECT') {
          select(message.data.payload);
        }
      }
    }
  }, [dispatch, select]);

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
