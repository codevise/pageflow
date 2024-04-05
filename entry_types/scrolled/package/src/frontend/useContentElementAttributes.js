import React, {createContext, useContext, useMemo} from 'react';

const ContentElementAttributesContext = createContext({});

export function ContentElementAttributesProvider({id, width, position, children}) {
  const attributes = useMemo(() => ({
    contentElementId: id,
    width,
    position
  }), [id, width, position]);

  return (
    <ContentElementAttributesContext.Provider value={attributes}>
      {children}
    </ContentElementAttributesContext.Provider>
  );
}

export function useContentElementAttributes() {
  return useContext(ContentElementAttributesContext);
}
