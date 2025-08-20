import React, {useState, useRef} from 'react';
import classNames from 'classnames';
import {useIsomorphicLayoutEffect} from 'pageflow-scrolled/frontend';

import styles from './MainStorylineSheet.module.css';

export function MainStorylineSheet({activeExcursion, children}) {
  const excursionActive = !!activeExcursion;
  const activeExcursionId = activeExcursion?.id;

  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [inactive, setInactive] = useState(false);

  const previousThemeColorRef = useRef();

  useIsomorphicLayoutEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')

    if (excursionActive) {
      setPreviousScrollY(window.scrollY);
      setInactive(true);

      previousThemeColorRef.current = themeColorMeta.getAttribute('content');
      themeColorMeta.setAttribute('content', '#000');
    }
    else {
      setInactive(false);

      themeColorMeta.setAttribute('content', previousThemeColorRef.current);
    }
  }, [excursionActive]);

  useIsomorphicLayoutEffect(() => {
    if (activeExcursionId) {
      window.scrollTo(0, 0);
    }
    else {
      setPreviousScrollY(previousScrollY => {
        window.queueMicrotask(() => window.scrollTo(0, previousScrollY));

        return previousScrollY;
      });
    }
  }, [activeExcursionId]);

  return (
    <div inert={inactive ? 'true' : undefined}
         style={{'--previous-scroll-y': `${previousScrollY}px`}}
         className={classNames(styles.wrapper, {[styles.inactive]: inactive})}>
      <div className={styles.scaler}>
        {children}
      </div>
    </div>
  );
}
