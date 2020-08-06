import React, {createContext, useContext, useMemo} from 'react';
import {useEntryStructure} from '../entryState';

export function getEventObject(sectionIndex, entryStructure){
  const getSectionChapterTitle = (sectionIndex, delimiter = '') => entryStructure.filter(
    chapter => chapter.sections.some(section => section.sectionIndex === sectionIndex)
  )[0]?.title + delimiter;

  let page = {
    configuration: {
      title: entryStructure ? getSectionChapterTitle(sectionIndex, ', ') + 'Section ' + sectionIndex : null,
    },
    index: sectionIndex === null ? -1 : sectionIndex,
  }

  return page;
}

export const EventContext = createContext(getEventObject());

export function EventContextDataProvider(props){
  const entryStructure = useEntryStructure();

  let contextValue = useMemo(()=>{
    return {page: getEventObject(props.sectionIndex, entryStructure)};
  }, [props.sectionIndex, entryStructure]);

  return (
    <EventContext.Provider value={contextValue}>
      {props.children}
    </EventContext.Provider>
  )
};

export function useEventContextData() {
  return useContext(EventContext);
}
