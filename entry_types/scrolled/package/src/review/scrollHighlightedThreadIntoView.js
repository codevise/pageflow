import React, {createContext, useContext} from 'react';

const ScrollHighlightedThreadIntoViewContext = createContext(false);

export function ScrollHighlightedThreadIntoViewProvider({children}) {
  return (
    <ScrollHighlightedThreadIntoViewContext.Provider value={true}>
      {children}
    </ScrollHighlightedThreadIntoViewContext.Provider>
  );
}

export function useScrollHighlightedThreadIntoView() {
  return useContext(ScrollHighlightedThreadIntoViewContext);
}
