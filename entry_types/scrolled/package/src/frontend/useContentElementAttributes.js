import React, {createContext, useContext, useMemo} from 'react';

const ContentElementAttributesContext = createContext({});

export function ContentElementAttributesProvider({id, children}) {
  const attributes = useMemo(() => ({contentElementId: id}), [id]);

  return (
    <ContentElementAttributesContext.Provider value={attributes}>
      {children}
    </ContentElementAttributesContext.Provider>
  );
}

export function useContentElementAttributes() {
  return useContext(ContentElementAttributesContext);
}
