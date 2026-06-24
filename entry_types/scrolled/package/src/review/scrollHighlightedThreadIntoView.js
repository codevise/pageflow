import React, {createContext, useContext} from 'react';

const ScrollHighlightedThreadIntoViewContext = createContext(false);

// Editor sidebar panels (see ReviewView) render their thread lists in a
// scrollable container and want the highlighted thread scrolled into
// view. The preview popover positions itself near its badge and manages
// its own scrolling, so it leaves this off (the default) to avoid
// fighting that.
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
