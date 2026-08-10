import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {flushSync} from 'react-dom';

const storageKey = 'pageflow.scrolled.commentingVisible';

const CommentingVisibilityContext = createContext({
  visible: true,
  toggle: () => {}
});

export function CommentingVisibilityProvider({children}) {
  const [visible, setVisible] = useState(readStoredVisibility);

  const toggle = useCallback(() => {
    const next = !visible;
    const flip = () => setVisible(next);

    // Morph the toolbar and its collapsed puck into each other where the
    // browser supports it. flushSync forces React to commit synchronously so
    // the transition captures the post-toggle DOM.
    if (document.startViewTransition) {
      document.startViewTransition(() => flushSync(flip));
    }
    else {
      flip();
    }

    storeVisibility(next);
  }, [visible]);

  const value = useMemo(() => ({visible, toggle}), [visible, toggle]);

  return (
    <CommentingVisibilityContext.Provider value={value}>
      {children}
    </CommentingVisibilityContext.Provider>
  );
}

export function useCommentingVisibility() {
  return useContext(CommentingVisibilityContext);
}

function readStoredVisibility() {
  return getLocalStorage()?.[storageKey] !== 'false';
}

function storeVisibility(visible) {
  const storage = getLocalStorage();

  if (storage) {
    storage[storageKey] = visible;
  }
}

function getLocalStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  }
  catch(e) {
    // Safari throws SecurityError when accessing window.localStorage
    // if cookies/website data are disabled.
    return null;
  }
}
