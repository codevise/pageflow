import React, {useEffect, useState, useCallback} from 'react';

import Chapter from "./Chapter";
import MutedContext from './MutedContext';
import ScrollToSectionContext from './ScrollToSectionContext';
import {useEntryStructure, useEntryStateDispatch} from '../entryState';
import {useEditorSelection} from './EditorState';
import {withInlineEditingDecorator} from './inlineEditing';
import {usePostMessageListener} from './usePostMessageListener';

import styles from './Entry.module.css';

export default withInlineEditingDecorator('EntryDecorator', function Entry(props) {
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

  const receiveMessage = useCallback(data => {
    if (data.type === 'ACTION') {
      dispatch(data.payload);
    }
    else if (data.type === 'SCROLL_TO_SECTION') {
      setScrollTargetSectionIndex(data.payload.index)
    }
    else if (data.type === 'SELECT') {
      select(data.payload);
    }
  }, [dispatch, select]);

  usePostMessageListener(receiveMessage);

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({type: 'READY'}, window.location.origin);
    }
  }, []);

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
})

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
