import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {flushSync} from 'react-dom';

const CommentingVisibilityContext = createContext({
  visible: true,
  toggle: () => {}
});

export function CommentingVisibilityProvider({children}) {
  const [visible, setVisible] = useState(true);

  const toggle = useCallback(() => {
    const flip = () => setVisible(previous => !previous);

    // Morph the toolbar and its collapsed puck into each other where the
    // browser supports it. flushSync forces React to commit synchronously so
    // the transition captures the post-toggle DOM.
    if (document.startViewTransition) {
      document.startViewTransition(() => flushSync(flip));
    }
    else {
      flip();
    }
  }, []);

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
