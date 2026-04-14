import React, {createContext, useContext, useMemo} from 'react';

const ContentElementAttributesContext = createContext({});

export function ContentElementAttributesProvider({id, permaId, width, position, inlineComments, children}) {
  const attributes = useMemo(() => ({
    contentElementId: id,
    contentElementPermaId: permaId,
    width,
    position,
    inlineComments
  }), [id, permaId, width, position, inlineComments]);

  return (
    <ContentElementAttributesContext.Provider value={attributes}>
      {children}
    </ContentElementAttributesContext.Provider>
  );
}

export function useContentElementAttributes() {
  return useContext(ContentElementAttributesContext);
}
