import React, {useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom';

import styles from './Fullscreen.module.css';

export function Fullscreen({children}) {
  const root = useMemo(() => document.getElementById('fullscreenRoot'), []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'initial';
  }, []);

  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      {children}
    </div>,
    root
  );
}
