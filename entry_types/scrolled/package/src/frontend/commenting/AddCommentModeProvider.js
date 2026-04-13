import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';

const AddCommentModeContext = createContext({
  active: false,
  toggle: () => {},
  deactivate: () => {}
});

export function AddCommentModeProvider({children}) {
  const [active, setActive] = useState(false);

  const toggle = useCallback(() => {
    setActive(prev => !prev);
  }, []);

  const deactivate = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    if (!active) return;

    function handlePointerDown(event) {
      if (!event.target.closest('[data-add-comment-overlay]') &&
          !event.target.closest('[data-add-comment-toggle]')) {
        setActive(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [active]);

  const value = useMemo(() => ({
    active,
    toggle,
    deactivate
  }), [active, toggle, deactivate]);

  return (
    <AddCommentModeContext.Provider value={value}>
      {children}
    </AddCommentModeContext.Provider>
  );
}

export function useAddCommentMode() {
  return useContext(AddCommentModeContext);
}
