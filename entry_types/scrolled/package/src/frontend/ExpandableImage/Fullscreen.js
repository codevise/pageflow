import React, {useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom';

import styles from './Fullscreen.module.css';

export function Fullscreen({children}) {
  const root = useMemo(() => document.getElementById('fullscreenRoot'), []);

  useEffect(() => {
    const resetScrollbarPadding = adjustScrollbarPadding(() => {
      document.getElementById('root').setAttribute('inert', true);
      document.body.style.overflow = 'hidden'
    });

    return () => {
      resetScrollbarPadding();

      document.getElementById('root').removeAttribute('inert', true)
      document.body.style.overflow = 'initial';
    }
  }, []);

  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      {children}
    </div>,
    root
  );
}

// Adapted from
// https://github.com/tailwindlabs/headlessui/blob/9dff5456fa196cdc304e2ed17ef47962a9364ce7/packages/%40headlessui-react/src/hooks/document-overflow/adjust-scrollbar-padding.ts
function adjustScrollbarPadding(hideScrollbar) {
  const documentElement = document.documentElement
  const ownerWindow = document.defaultView || window

  const scrollbarWidthBefore = ownerWindow.innerWidth - documentElement.clientWidth

  hideScrollbar();

  const scrollbarWidthAfter = documentElement.clientWidth - documentElement.offsetWidth
  const scrollbarWidth = scrollbarWidthBefore - scrollbarWidthAfter

  document.documentElement.style.paddingRight = `${scrollbarWidth}px`;

  return () => document.documentElement.style.paddingRight = '0';
}
