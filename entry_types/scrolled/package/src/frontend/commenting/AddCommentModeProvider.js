import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useSelectedSubject} from './SelectedSubjectProvider';

const AddCommentModeContext = createContext({
  active: false,
  toggle: () => {},
  deactivate: () => {},
  preselect: () => {},
  clearPreselection: () => {}
});

export function AddCommentModeProvider({children}) {
  const [active, setActive] = useState(false);
  const preselectionRef = useRef(null);
  const {select} = useSelectedSubject();

  const toggle = useCallback(() => {
    if (!active && preselectionRef.current) {
      select(preselectionRef.current);
      preselectionRef.current = null;
      return;
    }
    setActive(prev => !prev);
  }, [active, select]);

  const deactivate = useCallback(() => {
    setActive(false);
  }, []);

  const preselect = useCallback((subject) => {
    preselectionRef.current = subject;
  }, []);

  const clearPreselection = useCallback((subjectId) => {
    if (preselectionRef.current?.subjectId === subjectId) {
      preselectionRef.current = null;
    }
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
    deactivate,
    preselect,
    clearPreselection
  }), [active, toggle, deactivate, preselect, clearPreselection]);

  return (
    <AddCommentModeContext.Provider value={value}>
      {children}
    </AddCommentModeContext.Provider>
  );
}

export function useAddCommentMode() {
  return useContext(AddCommentModeContext);
}
