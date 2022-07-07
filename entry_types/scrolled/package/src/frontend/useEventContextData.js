import React, {createContext, useContext, useMemo} from 'react';

export function getEventObject(section) {
  let page = {
    configuration: {
      title: section ? section.chapter.title + ', Section ' + section.sectionIndex : null,
    },
    index: section ? section.sectionIndex : -1,
  }

  return page;
}

export const EventContext = createContext(getEventObject());

export function EventContextDataProvider({section, children}){
  let contextValue = useMemo(() => {
    return {page: getEventObject(section)};
  }, [section]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  )
};

export function useEventContextData() {
  return useContext(EventContext);
}
