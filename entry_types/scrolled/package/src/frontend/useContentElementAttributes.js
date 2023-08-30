import React, {createContext, useContext, useMemo} from 'react';

const ContentElementAttributesContext = createContext({});

export function ContentElementAttributesProvider({id, width, children}) {
  const attributes = useMemo(() => ({
    contentElementId: id,
    width
  }), [id, width]);

  return (
    <ContentElementAttributesContext.Provider value={attributes}>
      {children}
    </ContentElementAttributesContext.Provider>
  );
}

export function useContentElementAttributes() {
  return useContext(ContentElementAttributesContext);
}
