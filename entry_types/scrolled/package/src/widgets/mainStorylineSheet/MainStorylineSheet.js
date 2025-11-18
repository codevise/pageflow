import React, {useState, useRef} from 'react';
import classNames from 'classnames';
import {useIsomorphicLayoutEffect} from 'pageflow-scrolled/frontend';

import styles from './MainStorylineSheet.module.css';

export function MainStorylineSheet({activeExcursion, children}) {
  const excursionActive = !!activeExcursion;
  const activeExcursionId = activeExcursion?.id;

  const [previousScrollY, setPreviousScrollY] = useState(null);
  const [inactive, setInactive] = useState(false);
  const [fixedPositioningContainingBlock, setFixedPositioningContainingBlock] = useState(false);

  const previousThemeColorRef = useRef();
  const transitionTimeoutRef = useRef();

  useIsomorphicLayoutEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (excursionActive) {
      setPreviousScrollY(window.scrollY);
      setInactive(true);
      applyFixedPositioningContainingBlockOffset();

      previousThemeColorRef.current = themeColorMeta.getAttribute('content');
      themeColorMeta.setAttribute('content', '#000');
    }
    else {
      setInactive(false);
      scheduleFixedPositioningContainingBlockReset();

      if (previousThemeColorRef.current) {
        themeColorMeta.setAttribute('content', previousThemeColorRef.current);
      }
    }

    function applyFixedPositioningContainingBlockOffset() {
      setFixedPositioningContainingBlock(true);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    }

    function scheduleFixedPositioningContainingBlockReset() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setFixedPositioningContainingBlock(false);
      } else {
        const transitionDuration = 300;
        const buffer = 100;

        transitionTimeoutRef.current = setTimeout(() => {
          setFixedPositioningContainingBlock(false);
        }, transitionDuration + buffer);
      }
    }
  }, [excursionActive]);

  useIsomorphicLayoutEffect(() => {
    if (activeExcursionId) {
      window.scrollTo(0, 0);
    }
    else {
      setPreviousScrollY(previousScrollY => {
        if (previousScrollY !== null) {
          window.queueMicrotask(() => window.scrollTo(0, previousScrollY));
        }

        return previousScrollY;
      });
    }
  }, [activeExcursionId]);

  function resetFixedPositioningContainingBlock(event) {
    if (event.propertyName === 'filter' &&
        event.target === event.currentTarget &&
        !inactive) {
      clearTimeout(transitionTimeoutRef.current);
      setFixedPositioningContainingBlock(false);
    }
  }

  return (
    <div inert={inactive ? 'true' : undefined}
         style={{'--previous-scroll-y': `${previousScrollY || 0}px`}}
         className={classNames({
           [styles.inactive]: inactive,
           [styles.fixedPositioningContainingBlock]: fixedPositioningContainingBlock
         })}>
      <div className={styles.scaler}
           onTransitionEnd={fixedPositioningContainingBlock ?
                            resetFixedPositioningContainingBlock : undefined}>
        {children}
      </div>
    </div>
  );
}
