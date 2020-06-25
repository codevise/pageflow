import React, {createContext, useContext, useState, useEffect} from 'react';

import styles from './focusOutline.module.css';

const FocusVisibleContext = createContext();

export function useFocusOutlineVisible() {
  return useContext(FocusVisibleContext);
}

export function FocusOutlineProvider({children}) {
  const [value, setValue] = useState()

  useEffect(() => {
    document.body.addEventListener('keydown', enable);
    document.body.addEventListener('mousedown', disable);

    disable();

    return () => {
      document.body.removeEventListener('keydown', enable);
      document.body.removeEventListener('mousedown', disable);
    };

    function enable() {
      document.body.classList.remove(styles.focusOutlineDisabled)
      setValue(true);
    }

    function disable() {
      document.body.classList.add(styles.focusOutlineDisabled)
      setValue(false);
    }
  }, []);

  return (
    <FocusVisibleContext.Provider value={value}>
      {children}
    </FocusVisibleContext.Provider>
  );
}
