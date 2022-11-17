import React, {createContext, useContext, useMemo} from 'react';

export function getEventObject({section, sectionsCount}) {
  let page = {
    getAnalyticsData: () => ({
      chapterIndex: section?.chapter.index,
      chapterTitle: section?.chapter.title,

      index: section ? section.sectionIndex : -1,
      total: sectionsCount
    }),

    index: section ? section.sectionIndex : -1,

    configuration: {
      title: section ? section.chapter.title + ', Section ' + section.sectionIndex : null,
    }
  }

  return page;
}

export const EventContext = createContext(getEventObject({}));

export function EventContextDataProvider({section, sectionsCount, children}){
  let contextValue = useMemo(() => {
    return {page: getEventObject({section, sectionsCount})};
  }, [section, sectionsCount]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  )
};

export function useEventContextData() {
  return useContext(EventContext);
}
