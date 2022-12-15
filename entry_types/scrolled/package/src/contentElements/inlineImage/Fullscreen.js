import React, {useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom';

import styles from './Fullscreen.module.css';

export function Fullscreen({isFullscreen, children}) {
  const root = useMemo(() => document.getElementById('fullscreenRoot'), []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'initial';
    }
  }, [isFullscreen]);

  if (isFullscreen) {
    return ReactDOM.createPortal(
      <div className={styles.wrapper}>
        {children}
      </div>,  
      root
    );
  }
  else {
    return children;
  }
}
